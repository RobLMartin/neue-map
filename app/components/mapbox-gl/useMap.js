import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  useSearchParams,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
// import mockdata from "./mockdata";
const default_center = [-86.2463, 45.9578];
const default_zoom = 8;
export default function useMap() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { Mapbox_key } = useLoaderData();
  const { dataset } = useRouteLoaderData("routes/_app.$datasetId");

  const geoJson = dataset.data;
  const [isDarkMode, setIsDarkMode] = useState(
    window &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  mapboxgl.accessToken = Mapbox_key;

  useEffect(() => {
    moveToRandomPoint(dataset.data);
  }, [dataset]);

  const moveToRandomPoint = (geoJsonData) => {
    if (!geoJsonData || !geoJsonData.features || !geoJsonData.features.length) {
      return;
    }

    // Pick a random feature from the GeoJSON data
    const randomFeature =
      geoJsonData.features[
        Math.floor(Math.random() * geoJsonData.features.length)
      ];
    const coordinates = randomFeature.geometry.coordinates;

    // Ensure the map instance is available
    if (map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: default_zoom + 2,
        essential: true, // This ensures the map movement is smooth
      });
    }
  };

  /**
   * This handles subscribing and unsubscribing from the load event. Basically initializing mapbox.
   */
  useEffect(() => {
    const [first] = geoJson?.features || [];
    const center = first?.geometry?.coordinates ?? default_center;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${
          isDarkMode ? "dark-v11" : "light-v11"
        }`,
        center,
        zoom: default_zoom,
      });
    } else {
      const geojsonSource = map.current.getSource("projects");
      geojsonSource && geojsonSource.setData(geoJson);
      // geojsonSource && geojsonSource.setData(mockdata);
    }

    map.current.on("load", loadMapbox);

    return () => {
      map.current.off("load", loadMapbox);
    };
  }, [geoJson, isDarkMode]);

  const loadMapbox = () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.current.addSource("projects", {
      type: "geojson",
      data: geoJson,
      // data: mockdata, // geoJson,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.current.addLayer({
      id: "clusters",
      type: "circle",
      source: "projects",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "projects",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.current.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "projects",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 10,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // // inspect a cluster on click
    map.current.on("click", "clusters", (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map.current
        .getSource("projects")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    map.current.on("click", "unclustered-point", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // Dynamically create popup content based on feature properties
      let popupContent = '<div class="rounded text-neutral-950">';
      for (const [key, value] of Object.entries(properties)) {
        // Optionally, you can format the key to improve readability
        const formattedKey = key.replace(/([A-Z])/g, " $1").trim(); // Example: converts "issueDate" to "issue Date"
        popupContent += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
      }
      popupContent += "</div>";

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map.current);
    });

    map.current.on("mouseenter", "clusters", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "clusters", () => {
      map.current.getCanvas().style.cursor = "";
    });
  };

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setIsDarkMode(matcher.matches);
    };

    matcher.addEventListener("change", onChange);

    return () => {
      matcher.removeEventListener("change", onChange);
    };
  }, []);

  /**
   * This controls how we ease to different locations.
   */
  useEffect(() => {
    if (!map.current) {
      return;
    }
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");

    if (lat && long) {
      map.current.easeTo({
        center: [lat, long],
        zoom: 18,
      });
    } else {
      map.current.easeTo({
        center: default_center,
        zoom: default_zoom,
      });
    }
  }, [searchParams]);

  return mapContainer;
}
