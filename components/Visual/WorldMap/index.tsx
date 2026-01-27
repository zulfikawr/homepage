'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';

import { HeatmapLegend, Portal } from '@/components/UI';
import { useRadius } from '@/contexts/radiusContext';

// Helper to get CSS variable value for heatmap intensity
const getHeatmapIntensityValue = (intensity: number) => {
  switch (intensity) {
    case 1:
      return 'var(--heatmap-1)';
    case 2:
      return 'var(--heatmap-2)';
    case 3:
      return 'var(--heatmap-3)';
    case 4:
      return 'var(--heatmap-4)';
    case 5:
      return 'var(--heatmap-5)';
    case 6:
      return 'var(--heatmap-6)';
    default:
      return 'var(--heatmap-0)';
  }
};

interface WorldMapProps {
  data: { code: string; name: string; count: number }[];
  className?: string;
}

type WorldFeature = Feature<Geometry, GeoJsonProperties>;

// Map of Alpha-2 to Alpha-3 codes
const alpha2To3: Record<string, string> = {
  AF: 'AFG',
  AX: 'ALA',
  AL: 'ALB',
  DZ: 'DZA',
  AS: 'ASM',
  AD: 'AND',
  AO: 'AGO',
  AI: 'AIA',
  AQ: 'ATA',
  AG: 'ATG',
  AR: 'ARG',
  AM: 'ARM',
  AW: 'ABW',
  AU: 'AUS',
  AT: 'AUT',
  AZ: 'AZE',
  BS: 'BHS',
  BH: 'BHR',
  BD: 'BGD',
  BB: 'BRB',
  BY: 'BLR',
  BE: 'BEL',
  BZ: 'BLZ',
  BJ: 'BEN',
  BM: 'BMU',
  BT: 'BTN',
  BO: 'BOL',
  BQ: 'BES',
  BA: 'BIH',
  BW: 'BWA',
  BV: 'BVT',
  BR: 'BRA',
  IO: 'IOT',
  BN: 'BRN',
  BG: 'BGR',
  BF: 'BFA',
  BI: 'BDI',
  KH: 'KHM',
  CM: 'CMR',
  CA: 'CAN',
  CV: 'CPV',
  KY: 'CYM',
  CF: 'CAF',
  TD: 'TCD',
  CL: 'CHL',
  CN: 'CHN',
  CX: 'CXR',
  CC: 'CCK',
  CO: 'COL',
  KM: 'COM',
  CG: 'COG',
  CD: 'COD',
  CK: 'COK',
  CR: 'CRI',
  CI: 'CIV',
  HR: 'HRV',
  CU: 'CUB',
  CW: 'CUW',
  CY: 'CYP',
  CZ: 'CZE',
  DK: 'DNK',
  DJ: 'DJI',
  DM: 'DMA',
  DO: 'DOM',
  EC: 'ECU',
  EG: 'EGY',
  SV: 'SLV',
  GQ: 'GNQ',
  ER: 'ERI',
  EE: 'EST',
  ET: 'ETH',
  FK: 'FLK',
  FO: 'FRO',
  FJ: 'FJI',
  FI: 'FIN',
  FR: 'FRA',
  GF: 'GUF',
  PF: 'PYF',
  TF: 'ATF',
  GA: 'GAB',
  GM: 'GMB',
  GE: 'GEO',
  DE: 'DEU',
  GH: 'GHA',
  GI: 'GIB',
  GR: 'GRC',
  GL: 'GRL',
  GD: 'GRD',
  GP: 'GLP',
  GU: 'GUM',
  GT: 'GTM',
  GG: 'GGY',
  GN: 'GIN',
  GW: 'GNB',
  GY: 'GUY',
  HT: 'HTI',
  HM: 'HMD',
  VA: 'VAT',
  HN: 'HND',
  HK: 'HKG',
  HU: 'HUN',
  IS: 'ISL',
  IN: 'IND',
  ID: 'IDN',
  IR: 'IRN',
  IQ: 'IRQ',
  IE: 'IRL',
  IM: 'IMN',
  IL: 'ISR',
  IT: 'ITA',
  JM: 'JAM',
  JP: 'JPN',
  JE: 'JEY',
  JO: 'JOR',
  KZ: 'KAZ',
  KE: 'KEN',
  KI: 'KIR',
  KP: 'PRK',
  KR: 'KOR',
  KW: 'KWT',
  KG: 'KGZ',
  LA: 'LAO',
  LV: 'LVA',
  LB: 'LBN',
  LS: 'LSO',
  LR: 'LBR',
  LY: 'LBY',
  LI: 'LIE',
  LT: 'LTU',
  LU: 'LUX',
  MO: 'MAC',
  MK: 'MKD',
  MG: 'MDG',
  MW: 'MWI',
  MY: 'MYS',
  MV: 'MDV',
  ML: 'MLI',
  MT: 'MLT',
  MH: 'MHL',
  MQ: 'MTQ',
  MR: 'MRT',
  MU: 'MUS',
  YT: 'MYT',
  MX: 'MEX',
  FM: 'FSM',
  MD: 'MDA',
  MC: 'MCO',
  MN: 'MNG',
  ME: 'MNE',
  MS: 'MSR',
  MA: 'MAR',
  MZ: 'MOZ',
  MM: 'MMR',
  NA: 'NAM',
  NR: 'NRU',
  NP: 'NPL',
  NL: 'NLD',
  NC: 'NCL',
  NZ: 'NZL',
  NI: 'NIC',
  NE: 'NER',
  NG: 'NGA',
  NU: 'NIU',
  NF: 'NFK',
  MP: 'MNP',
  NO: 'NOR',
  OM: 'OMN',
  PK: 'PAK',
  PW: 'PLW',
  PS: 'PSE',
  PA: 'PAN',
  PG: 'PNG',
  PY: 'PRY',
  PE: 'PER',
  PH: 'PHL',
  PN: 'PCN',
  PL: 'POL',
  PT: 'PRT',
  PR: 'PRI',
  QA: 'QAT',
  RE: 'REU',
  RO: 'ROU',
  RU: 'RUS',
  RW: 'RWA',
  BL: 'BLM',
  SH: 'SHN',
  KN: 'KNA',
  LC: 'LCA',
  MF: 'MAF',
  PM: 'SPM',
  VC: 'VCT',
  WS: 'WSM',
  SM: 'SMR',
  ST: 'STP',
  SA: 'SAU',
  SN: 'SEN',
  RS: 'SRB',
  SC: 'SYC',
  SL: 'SLE',
  SG: 'SGP',
  SX: 'SXM',
  SK: 'SVK',
  SI: 'SVN',
  SB: 'SLB',
  SO: 'SOM',
  ZA: 'ZAF',
  GS: 'SGS',
  SS: 'SSD',
  ES: 'ESP',
  LK: 'LKA',
  SD: 'SDN',
  SR: 'SUR',
  SJ: 'SJM',
  SZ: 'SWZ',
  SE: 'SWE',
  CH: 'CHE',
  SY: 'SYR',
  TW: 'TWN',
  TJ: 'TJK',
  TZ: 'TZA',
  TH: 'THA',
  TL: 'TLS',
  TG: 'TGO',
  TK: 'TKL',
  TO: 'TON',
  TT: 'TTO',
  TN: 'TUN',
  TR: 'TUR',
  TM: 'TKM',
  TC: 'TCA',
  TV: 'TUV',
  UG: 'UGA',
  UA: 'UKR',
  AE: 'ARE',
  GB: 'GBR',
  US: 'USA',
  UM: 'UMI',
  UY: 'URY',
  UZ: 'UZB',
  VU: 'VUT',
  VE: 'VEN',
  VN: 'VNM',
  VG: 'VGB',
  VI: 'VIR',
  WF: 'WLF',
  EH: 'ESH',
  YE: 'YEM',
  ZM: 'ZMB',
  ZW: 'ZWE',
};

// Mercator projection implementation
function mercatorProjection(
  lon: number,
  lat: number,
  scale: number,
  translateX: number,
  translateY: number,
): [number, number] {
  const x = scale * ((lon * Math.PI) / 180);
  const y = scale * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));
  return [x + translateX, translateY - y];
}

// Convert GeoJSON geometry to SVG path string
function geometryToPath(
  geometry: Geometry,
  project: (lon: number, lat: number) => [number, number],
): string {
  const pathParts: string[] = [];

  if (geometry.type === 'Polygon') {
    const polygon = geometry as Polygon;
    polygon.coordinates.forEach((ring) => {
      ring.forEach((coord, index) => {
        const [x, y] = project(coord[0], coord[1]);
        if (index === 0) {
          pathParts.push(`M${x.toFixed(2)},${y.toFixed(2)}`);
        } else {
          pathParts.push(`L${x.toFixed(2)},${y.toFixed(2)}`);
        }
      });
      pathParts.push('Z');
    });
  } else if (geometry.type === 'MultiPolygon') {
    const multiPolygon = geometry as MultiPolygon;
    multiPolygon.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((coord, index) => {
          const [x, y] = project(coord[0], coord[1]);
          if (index === 0) {
            pathParts.push(`M${x.toFixed(2)},${y.toFixed(2)}`);
          } else {
            pathParts.push(`L${x.toFixed(2)},${y.toFixed(2)}`);
          }
        });
        pathParts.push('Z');
      });
    });
  }

  return pathParts.join(' ');
}

export default function WorldMap({ data, className }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    count: number;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const { radius } = useRadius();

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    )
      .then((response) => response.json())
      .then((geojson) => setWorldData(geojson));
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!worldData || !svgRef.current || !containerRef.current) return;

    const svg = svgRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height =
      container.clientHeight || Math.max(400, Math.round(width / 2));

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Setup projection parameters
    const scale = width / 2 / Math.PI;
    const translateX = width / 2;
    const translateY = height / 1.5;

    const project = (lon: number, lat: number) =>
      mercatorProjection(lon, lat, scale, translateX, translateY);

    // Create counts map
    const counts = new Map(
      memoizedData.map((d) => [alpha2To3[d.code] || d.code, d.count]),
    );
    const maxCount = Math.max(...memoizedData.map((d) => d.count), 1);

    // Helper to get discrete intensity level
    const getIntensity = (count: number) => {
      if (count === 0) return 0;
      if (count <= maxCount * 0.1) return 1;
      if (count <= maxCount * 0.2) return 2;
      if (count <= maxCount * 0.35) return 3;
      if (count <= maxCount * 0.55) return 4;
      if (count <= maxCount * 0.75) return 5;
      return 6;
    };

    // Create group element
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(g);

    // Render paths
    worldData.features.forEach((feature: WorldFeature) => {
      if (!feature.geometry) return;

      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      );
      const count = counts.get(feature.id as string) || 0;
      const intensity = getIntensity(count);
      const pathData = geometryToPath(feature.geometry, project);

      path.setAttribute('d', pathData);
      path.setAttribute('fill', getHeatmapIntensityValue(intensity));
      path.setAttribute('stroke', 'var(--border)');
      path.setAttribute('stroke-width', '0.5');
      path.setAttribute(
        'class',
        'transition-colors hover:opacity-80 cursor-pointer',
      );

      // Event listeners
      path.addEventListener('mouseover', (event: MouseEvent) => {
        setHoveredCountry({
          name: feature.properties?.name || 'Unknown',
          count,
        });
        setTooltipPos({
          top: (event as MouseEvent).clientY - 10,
          left: (event as MouseEvent).clientX,
        });
      });

      path.addEventListener('mouseout', () => {
        setHoveredCountry(null);
      });

      g.appendChild(path);
    });
  }, [worldData, memoizedData]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[200px] ${className}`}
    >
      <svg ref={svgRef} className='w-full h-full' />

      {hoveredCountry && (
        <Portal>
          <div
            className='fixed z-[10000] px-3 py-1.5 text-xs font-medium text-popover-foreground bg-popover border border-border shadow-lg whitespace-nowrap pointer-events-none'
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translate(-50%, -100%)',
              borderRadius: `${radius}px`,
            }}
          >
            <strong>{hoveredCountry.name}</strong>
            <br />
            {hoveredCountry.count} visitors
          </div>
        </Portal>
      )}

      <div className='absolute bottom-4 right-4'>
        <HeatmapLegend />
      </div>
    </div>
  );
}
