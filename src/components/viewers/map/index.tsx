import { FileProps, ViewerMetadata } from "../interfaces"

import { Box, Flex, Text } from 'theme-ui';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useThemeUI } from 'theme-ui'


import Overlay from 'ol/Overlay.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { useGeographic } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector';
import VectorTile from "ol/layer/VectorTile";
import VectorLayer from 'ol/layer/Vector.js';
import { PMTilesVectorSource } from "ol-pmtiles";
import { Style, Stroke, Fill } from 'ol/style';

export const viewerMetadata: ViewerMetadata = {
    title: "Map Viewer",
    description: "A map viewer.",
    compatibilityCheck: (props: FileProps) => {
        if (props.filename.toLowerCase().endsWith(".pmtiles")) {
            return true;
        }
        
        if (props.filename.toLowerCase().endsWith(".geojson")) {
            return true;
        }
        
        return false;
    },
    viewer: MapViewer
} 

enum DataSourceType {
    PMTILES,
    GEOJSON
}

export function MapViewer(props: FileProps) {
    const { url, filename, contentType, size } = props;
    const { theme: { rawColors }, setColorMode } = useThemeUI()
    
    let dataSource: DataSourceType;
    
    if (filename.toLowerCase().endsWith(".pmtiles")) {
        dataSource = DataSourceType.PMTILES;
    }
    
    if (filename.toLowerCase().endsWith(".geojson")) {
        dataSource = DataSourceType.GEOJSON;
    }
    
    
    const mapElement = useRef();
    const popupRef = useRef();
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        let source;
        let layer;
        if (dataSource == DataSourceType.PMTILES) {
            source = new PMTilesVectorSource({
                url: url,
            });
            
            source.on("tileloaderror", (e) => {
                setError(true);
            });
            
            layer = new VectorTile({
                declutter: true,
                source: source,
                style: (feature) => {
                    const color = feature.get('COLOR') || "black";
                    style.getFill().setColor(color);
                    return style;
                }
            });
        }
        
        if (dataSource == DataSourceType.GEOJSON) {
            source = new VectorSource({
                url: url,
                format: new GeoJSON(),
            })
            
            source.on("featuresloadstart", (e) => {
                setLoading(true);
            });

            source.on("featuresloadend", (e) => {
                setLoading(false);
                m.getView().fit(source.getExtent());
            });

            source.on("featuresloaderror", (e) => {
                setError(true);
            })
            
            layer = new VectorLayer({
                declutter: true,
                source: source,
                style: new Style({
                stroke: new Stroke({
                    color: "gray",
                    width: 1,
                }),
                fill: new Fill({
                    color: "rgba(20,20,20,0.9)",
                }),
                }),
            })
        }
        
        const basemapStyle = new Style({
            stroke: new Stroke({
                color: rawColors.highlight as string,
                width: 1
            }),
            fill: new Fill({
                color: rawColors.primary as string
            })
        })
        
        const style = new Style({
            stroke: new Stroke({
              color: rawColors.primary as string,
              width: 1,
            }),
            fill: new Fill({
              color: rawColors.primary as string,
            }),
        })

        
        useGeographic();

        const displayFeatureInfo = function (pixel) {
            layer.getFeatures(pixel).then(function (features) {
              const feature = features.length ? features[0] : undefined;
              if (features.length) {
                feature["COLOR"] = rawColors.highlight as string;
                var props = []
                Object.keys(feature.getProperties()).forEach((k, i) => {
                    props.push([k, feature.getProperties()[k]])
                })
                setSelectedFeature(props);
              } else {
                overlay.setPosition(undefined);
                setSelectedFeature(null);
              }
            });
        };

        const overlay = new Overlay({
            element: popupRef.current,
            autoPan: {
              animation: {
                duration: 250,
              },
            },
        });

        const m = new Map({
            target: mapElement.current,
            controls: [],
            layers: [
                new VectorTile({
                    source: new PMTilesVectorSource({
                        url: "https://r2-public.protomaps.com/protomaps-sample-datasets/protomaps-basemap-opensource-20230408.pmtiles"
                    }),
                    style: (feature) => {
                        const color = feature.get('COLOR') || rawColors.background as string;
                        basemapStyle.getFill().setColor(color);
                        return basemapStyle;
                    }
                }),
                layer
            ],
            overlays: [overlay],
            view: new View({
              center: [0, 0],
              zoom: 0
            })
          });

        m.on('click', function (evt) {
          const coordinate = evt.coordinate;
          displayFeatureInfo(evt.pixel);
          overlay.setPosition(coordinate);
        });

        setMap(m);

        return () => m.setTarget(null);
    }, []);

    return (<>
        <Box sx={{width: "100%", height: "50vh", position: "relative", p: 1, backgroundColor: "primary"}} ref={mapElement} className="map-container">
            <Box sx={{position: "absolute", zIndex: 998, top: 2, left: 2}}>
                <Box ref={popupRef} sx={{backgroundColor: "background", color: "text", fontFamily: "mono", fontSize: 0, padding: 1, borderWidth: 2, borderStyle: "solid", borderColor: "primary"}}>
                    {
                        selectedFeature ? selectedFeature.map((k, i) => {
                            return <Box key={`prop-${i}`}>{k[0]}:{k[1]}</Box>
                        }) : <></>
                    }
                </Box>
                <Flex sx={{flexDirection: "column", gap: 1}}>
                <Flex sx={{
                    backgroundColor: "background",
                    fontFamily: "mono",
                    color: "text",
                    fontSize: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    width: "25px",
                    height: "25px",
                    userSelect: "none",
                    borderColor: "text",
                    borderWidth: 4,
                    borderStyle: "solid",
                    justifyContent: "center",
                    alignItems: "last baseline"
                }}  onClick={(e) => {map.getView().setZoom(map.getView().getZoom()+1)}}>
                    <Text>+</Text>
                </Flex>
                <Flex sx={{
                    backgroundColor: "background",
                    fontFamily: "mono",
                    color: "text",
                    fontSize: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    width: "25px",
                    height: "25px",
                    userSelect: "none",
                    borderColor: "text",
                    borderWidth: 4,
                    borderStyle: "solid",
                    justifyContent: "center",
                    alignItems: "end"
                }}  onClick={(e) => {map.getView().setZoom(map.getView().getZoom()-1)}}>
                    <Text>-</Text>
                </Flex>
                
                
                </Flex>
            </Box>
            <Box sx={{position: "absolute", opacity: "0.8", justifyContent: "center", alignItems: "center", zIndex: 999, left: 1, right: 1, top: 1, bottom: 1, backgroundColor: "background", display: loading || error ? "flex" : "none"}}>
                <Text sx={{
                    fontFamily: "mono",
                    fontSize: 5,
                    clipPath: !error ? "inset(0 3ch 0 0)" : null,
                    animation: !error ? "l 1.5s steps(4) infinite": null,
                }}>{ error ? "Error Loading File" : "Loading..."}</Text>
            </Box>
        </Box>
        </>
    )
}