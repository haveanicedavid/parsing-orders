export type Order = {
  type: "buy" | "sell";
  price: number;
  quantity: number;
};

export type Trade = {
  price: number;
  quantity: number;
};

export type OrderBook = {
  bids: Trade[];
  asks: Trade[];
};

type ProcessedOrder = {
  trades: Trade[];
  updatedOrderBook: OrderBook;
};

export function processOrder(
  order: Order,
  orderBook: OrderBook,
): ProcessedOrder {
  if (order.type === "sell") {
    return processSellOrder(order, orderBook);
  } else if (order.type === "buy") {
    // TODO
  } else {
    throw new Error("Invalid order type");
  }

  return { trades: [], updatedOrderBook: orderBook };
}

function processSellOrder(
  order: Order,
  orderBook: OrderBook,
  trades: Trade[] = [],
): ProcessedOrder {
  const updatedOrderBook: OrderBook = {
    bids: [...orderBook.bids],
    asks: [...orderBook.asks],
  };

  // NOTE: assumes first bid is the highest
  const bid = updatedOrderBook.bids[0];
  if (bid.price >= order.price) {
    if (bid.quantity === order.quantity) {
      trades.push({ price: bid.price, quantity: order.quantity });
      updatedOrderBook.bids.shift();
    }
    if (bid.quantity > order.quantity) {
      trades.push({ price: bid.price, quantity: order.quantity });
      bid.quantity = roundNumber(bid.quantity - order.quantity);
    }
    if (bid.quantity < order.quantity) {
      trades.push({ price: bid.price, quantity: bid.quantity });
      // recurse using new trades + updated order book
      return processSellOrder(
        {
          type: "sell",
          price: order.price,
          quantity: roundNumber(order.quantity - bid.quantity),
        },
        { bids: updatedOrderBook.bids.slice(1), asks: updatedOrderBook.asks },
        trades,
      );
    }
  } else {
    // no new trades, just add to asks
    updatedOrderBook.asks.push({
      price: order.price,
      quantity: order.quantity,
    });
  }

  return { trades, updatedOrderBook };
}

/** TODO: This isn't ideal, but otherwise we run into a floating point issue.
 * Should probably use a number lib in real world with more complex numbers */
const roundNumber = (num: number) => Math.round(num * 100) / 100;
