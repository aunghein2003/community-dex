import React from "react";
import type { API } from "@orderly.network/types";
import { Badge, formatAddress, ListView } from "@orderly.network/ui";
import { AuthGuardDataTable } from "@orderly.network/ui-connector";
import { SymbolProvider } from "../../provider/symbolProvider";
import type { PositionsProps } from "../../types/types";
import type { CombinePositionsState } from "./combinePositions.script";
import { useColumn } from "./desktop/useColumn";
import { PositionCellWidget } from "./mobile/positionCell";
import type { PositionsState } from "./positions.script";
import { PositionsRowProvider } from "./positionsRowProvider";

export const Positions: React.FC<Readonly<PositionsState>> = (props) => {
  const {
    pnlNotionalDecimalPrecision,
    sharePnLConfig,
    pagination,
    isLoading,
    dataSource,
    onSymbolChange,
  } = props;

  const columns = useColumn({
    pnlNotionalDecimalPrecision,
    sharePnLConfig,
    onSymbolChange: onSymbolChange,
  });

  return (
    <AuthGuardDataTable<API.PositionTPSLExt>
      loading={isLoading}
      id="oui-desktop-positions-content"
      columns={columns}
      bordered
      dataSource={dataSource}
      generatedRowKey={(record: any) => record.symbol}
      renderRowContainer={(record: any, index: number, children: any) => {
        return (
          <SymbolProvider symbol={record.symbol}>
            <PositionsRowProvider position={record}>
              {children}
            </PositionsRowProvider>
          </SymbolProvider>
        );
      }}
      manualPagination={false}
      pagination={pagination}
      manualSorting={true}
      onSort={props.onSort}
      initialSort={
        props.initialSort
          ? {
              sortKey: props.initialSort.sortKey,
              sort: props.initialSort.sortOrder,
            }
          : undefined
      }
      testIds={{
        body: "oui-testid-dataList-position-tab-body",
      }}
    />
  );
};

export const MobilePositions: React.FC<
  Readonly<PositionsState & PositionsProps>
> = (props) => {
  const {
    pnlNotionalDecimalPrecision,
    sharePnLConfig,
    dataSource,
    onSymbolChange,
  } = props;
  return (
    <ListView
      className="oui-hide-scrollbar oui-w-full oui-space-y-0 oui-overflow-y-hidden"
      contentClassName="!oui-space-y-1"
      dataSource={dataSource}
      renderItem={(item, index) => (
        <SymbolProvider symbol={item.symbol}>
          <PositionsRowProvider position={item}>
            <PositionCellWidget
              item={item}
              index={index}
              pnlNotionalDecimalPrecision={pnlNotionalDecimalPrecision}
              sharePnLConfig={sharePnLConfig}
              onSymbolChange={onSymbolChange}
            />
          </PositionsRowProvider>
        </SymbolProvider>
      )}
    />
  );
};

export const CombinePositions: React.FC<Readonly<CombinePositionsState>> = (
  props,
) => {
  const {
    pnlNotionalDecimalPrecision,
    sharePnLConfig,
    pagination,
    isLoading,
    tableData,
    onSymbolChange,
    mutatePositions,
  } = props;

  const columns = useColumn({
    pnlNotionalDecimalPrecision,
    sharePnLConfig,
    onSymbolChange: onSymbolChange,
  });

  const { dataSource = [] } = tableData;

  return (
    <AuthGuardDataTable<any>
      bordered
      loading={isLoading}
      id="oui-desktop-positions-content"
      columns={columns}
      dataSource={dataSource}
      expanded
      getSubRows={(row) => row.children}
      generatedRowKey={(record) => record.id}
      onCell={(column, record) => {
        const isGroup = (record.children ?? []).length > 0;
        if (isGroup) {
          return {
            children:
              column.id === "symbol" ? (
                <Badge color="neutral" size="xs">
                  {record?.description || formatAddress(record?.id)}
                </Badge>
              ) : null,
          };
        }
      }}
      renderRowContainer={(record: any, index: number, children: any) => {
        if (record.symbol) {
          return (
            <SymbolProvider symbol={record.symbol}>
              <PositionsRowProvider
                position={record}
                mutatePositions={mutatePositions}
              >
                {children}
              </PositionsRowProvider>
            </SymbolProvider>
          );
        }
        return children;
      }}
      manualPagination={false}
      pagination={pagination}
      testIds={{
        body: "oui-testid-dataList-position-tab-body",
      }}
    />
  );
};
