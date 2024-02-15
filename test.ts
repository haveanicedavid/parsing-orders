import { processOrder, type Order, type OrderBook } from "./process-order";

const defaultOrderBook: OrderBook = {
  bids: [
    // Buy orders
    { price: 10.0, quantity: 0.3 },
    { price: 9.5, quantity: 2.9 },
    { price: 9.0, quantity: 0.1 },
    { price: 8.5, quantity: 1.2 },
  ],
  asks: [
    // Sell orders
    { price: 10.5, quantity: 2.4 },
    { price: 11.0, quantity: 1.4 },
    { price: 11.5, quantity: 1.3 },
    { price: 12.0, quantity: 0.9 },
  ],
};

describe("Unit 410 challenge", () => {
  it("Should take an order and output trades + updated order book", () => {
    const expectedTrades = [
      { price: 10.0, quantity: 0.3 },
      { price: 9.5, quantity: 0.2 },
    ];
    const expectedOrderBook = {
      bids: [
        { price: 9.5, quantity: 2.7 },
        { price: 9.0, quantity: 0.1 },
        { price: 8.5, quantity: 1.2 },
      ],
      asks: [
        { price: 10.5, quantity: 2.4 },
        { price: 11.0, quantity: 1.4 },
        { price: 11.5, quantity: 1.3 },
        { price: 12.0, quantity: 0.9 },
      ],
    };
    const order: Order = { type: "sell", price: 9.0, quantity: 0.5 };

    const { trades, updatedOrderBook } = processOrder(order, defaultOrderBook);

    expect(JSON.stringify(trades)).toEqual(JSON.stringify(expectedTrades));
    expect(JSON.stringify(updatedOrderBook)).toEqual(
      JSON.stringify(expectedOrderBook),
    );
  });
});
