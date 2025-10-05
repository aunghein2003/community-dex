/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useId, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { Props as ResponsiveContainerProps } from "recharts/types/component/ResponsiveContainer";
import { useTranslation } from "@orderly.network/i18n";
import { useScreen } from "@orderly.network/ui";
import { tickFormatter } from "../utils/yTickFormatter";
import { OrderlyChartTooltip } from "./customTooltip";
import { useColors } from "./useColors";
import { XAxisLabel } from "./xAxisLabel";

export type AssetChartDataItem = {
  date: string;
  account_value: number;
};

export type PnlAreaChartProps = {
  colors?: {
    profit: string;
    loss: string;
  };
  data: AssetChartDataItem[];
  invisible?: boolean;
  responsiveContainerProps?: Omit<ResponsiveContainerProps, "children">;
};

const CustomTooltip: React.FC<TooltipProps<any, any>> = (props) => {
  const { active, payload, label } = props;
  const todayStr = useRef(new Date().toISOString().split("T")[0]);
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <OrderlyChartTooltip
        label={label === todayStr.current ? t("chart.now") : label}
        value={payload[0].value}
      />
    );
  }

  return null;
};

export const AssetAreaChart: React.FC<PnlAreaChartProps> = (props) => {
  const { responsiveContainerProps } = props;
  const colors = useColors(props.colors);
  const colorId = useId();
  const { isMobile } = useScreen();
  const chartComponent = (
    <AreaChart
      width={530}
      height={180}
      data={props.data}
      margin={{ top: 20, right: 10, left: -20, bottom: -10 }}
    >
      <CartesianGrid vertical={false} stroke="#FFFFFF" strokeOpacity={0.04} />
      <XAxis
        dataKey="date"
        interval={props.data.length - 2}
        // tick={{ fontSize: 10, fill: "rgba(255,255,255,0.54)" }}
        tick={<XAxisLabel />}
        stroke="#FFFFFF"
        strokeOpacity={0.04}
      />
      <YAxis
        dataKey="account_value"
        tick={{ fontSize: 10, fill: "rgba(255,255,255,0.54)" }}
        tickLine={false}
        axisLine={false}
        tickFormatter={tickFormatter}
      />
      {!props.invisible && (
        <Tooltip
          cursor={{ strokeDasharray: "3 2", strokeOpacity: 0.16 }}
          content={<CustomTooltip />}
        />
      )}
      {!props.invisible && (
        <>
          <defs>
            <linearGradient id={colorId} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#00B49E" offset="0%" stopOpacity={0.5} />
              <stop stopColor="#00B49E" offset="100%" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="natural"
            dataKey="account_value"
            stroke={colors.profit}
            strokeWidth={isMobile ? 1.5 : 2}
            dot={false}
            isAnimationActive={false}
            fill={`url(#${colorId})`}
          />
        </>
      )}
    </AreaChart>
  );

  return (
    <ResponsiveContainer
      className={props.invisible ? "chart-invisible" : undefined}
      {...responsiveContainerProps}
    >
      {chartComponent}
    </ResponsiveContainer>
  );
};
