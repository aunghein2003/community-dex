import { TradingPage } from "@orderly.network/trading";

function App() {
  return (
    <>
      <TradingPage
        symbol={"PERP_ETH_USDC"}
        onSymbolChange={(symbol) => console.log(symbol)}
        tradingViewConfig={{
          scriptSRC: "/tradingview/charting_library/charting_library.js",
          library_path: "/tradingview/charting_library/",
          customCssUrl: "/tradingview/chart.css",
        }}
        // sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </>
  );
}

export default App;
