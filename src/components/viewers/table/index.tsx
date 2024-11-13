/** @jsxImportSource theme-ui */

import { FileProps, ViewerMetadata } from "../interfaces";
import { useEffect, useState } from "react";
import { AspectRatio, Box, Text } from "theme-ui";
import Skeleton from "react-loading-skeleton";
import { csv, tsv } from "d3-fetch";
import type { DSVRowArray } from "d3-dsv";

const extensionToFunction = {
  ".csv": csv,
  ".tsv": tsv,
} as const;

export const viewerMetadata: ViewerMetadata = {
  title: "Table Viewer",
  description: "A table viewer.",
  compatibilityCheck: (props: FileProps) => {
    if (
      Object.keys(extensionToFunction).some((key) =>
        props.filename.toLowerCase().endsWith(key)
      )
    ) {
      return true;
    }
    return false;
  },
  viewer: TableViewer,
};

const MAX_NUM_ROWS = 100;
const MAX_CELL_LENGTH = 100;
type RowArray = DSVRowArray & { numRows?: number };

export function TableViewer(props: FileProps) {
  const { url, filename, contentType, size } = props;

  const [error, setError] = useState<string>(null);
  const [data, setData] = useState<RowArray>(null);

  async function fetchData(url: string, filename: string) {
    try {
      const extensionKey = Object.keys(extensionToFunction).find((key) =>
        props.filename.toLowerCase().endsWith(key)
      );
      if (!extensionKey) {
        setError("Unsupported file format.");
        return;
      }
      const fetchFunction = extensionToFunction[extensionKey];

      // TODO(SL): stream the first rows instead of downloading the whole CSV (https://observablehq.com/@mbostock/streaming-csv)
      const data: RowArray = await fetchFunction(url);
      data.numRows = data.length;
      data.splice(MAX_NUM_ROWS);
      for (const row of data) {
        for (const key in row) {
          row[key] = row[key].toString().slice(0, MAX_CELL_LENGTH + 1);
          if (row[key].length === MAX_CELL_LENGTH + 1) {
            row[key] = row[key].slice(0, MAX_CELL_LENGTH) + "…";
          }
        }
      }
      setData(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if (!error) {
      return;
    }
    setData(null);
  }, [error]);

  useEffect(() => {
    fetchData(url, filename);
  }, [url, filename]);

  if (!data) {
    return (
      <AspectRatio
        ratio={4 / 1}
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!error && <Skeleton count={10} />}
        {error && <Text>{error}</Text>}
      </AspectRatio>
    );
  }

  return (
    <figure sx={{ margin: 0 }}>
      <Box
        sx={{
          overflow: "auto",
          width: "100%",
          maxHeight: "500px",
          border: "1px solid",
          borderColor: "text",
        }}
      >
        <table
          sx={{
            minWidth: "100%",
            borderCollapse: "collapse",
            fontFamily: "mono",
            fontSize: "0.8rem",

            "th, td": {
              padding: "0.5rem",
            },
          }}
        >
          <thead
            sx={{
              borderColor: "text",
              backgroundColor: "text",
              color: "background",
              top: 0,
              position: "sticky",
            }}
          >
            <tr>
              {data.columns.map((column, i) => (
                <th scope="col" key={`column-${i}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            sx={{
              td: {
                border: "1px solid",
                borderColor: "text",
              },
              "td:first-child": {
                borderLeft: "none",
              },
              "td:last-child": {
                borderRight: "none",
              },
              "tr:last-child td": {
                borderBottom: "none",
              },
            }}
          >
            {data.map((row, i) => {
              return (
                <tr key={`row-${i}`}>
                  {data.columns.map((column, j) => {
                    return (
                      <td
                        sx={{
                          textAlign: "left",
                        }}
                        key={`cell-${i}-${j}`}
                      >
                        {row[column]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
      <figcaption
        sx={{
          margin: "1rem 0",
        }}
      >
        File "{filename}". {data.columns.length} columns.{" "}
        {data.numRows && data.numRows != data.length
          ? `Showing the first ${data.length.toLocaleString(
              "en-US"
            )} of ${data.numRows.toLocaleString("en-US")} rows.`
          : `${data.length.toLocaleString("en-US")} rows.`}
      </figcaption>
    </figure>
  );
}
