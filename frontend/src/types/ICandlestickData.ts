import { UTCTimestamp } from 'lightweight-charts';

export default interface ICandlestickData {
  time: UTCTimestamp; // Time in seconds since epoch (UNIX timestamp)
  open: number; // Opening price
  high: number; // Highest price
  low: number; // Lowest price
  close: number; // Closing price
}
