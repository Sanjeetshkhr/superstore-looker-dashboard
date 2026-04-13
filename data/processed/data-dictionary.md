# Data Dictionary

## Original Fields (from Superstore CSV)
| Field | Type | Description |
|---|---|---|
| Row ID | Number | Unique row identifier |
| Order ID | Text | Unique order identifier |
| Order Date | Date | Date the order was placed |
| Ship Date | Date | Date the order was shipped |
| Ship Mode | Text | Shipping method (Standard, First, Second, Same Day) |
| Customer ID | Text | Unique customer identifier |
| Customer Name | Text | Customer full name |
| Segment | Text | Customer segment (Consumer, Corporate, Home Office) |
| Country | Text | Country of sale |
| City | Text | City of sale |
| State | Text | State of sale |
| Postal Code | Number | Postal code |
| Region | Text | Sales region (West, East, Central, South) |
| Product ID | Text | Unique product identifier |
| Category | Text | Product category (Furniture, Office Supplies, Technology) |
| Sub-Category | Text | Product sub-category (17 values) |
| Product Name | Text | Full product name |
| Sales | Number | Revenue from the line item |
| Quantity | Number | Units sold |
| Discount | Number | Discount applied (0 to 0.8) |
| Profit | Number | Profit from the line item |

## Derived Fields (created by Apps Script)
| Field | Type | Formula | Description |
|---|---|---|---|
| Order Year | Number | Year of Order Date | Extracted year for YoY analysis |
| Order Month | Date | First day of order month | For time series grouping |
| Profit Margin | Number | Profit / Sales | Row-level profitability |
| Discount Band | Text | Categorized discount | No Discount / Low / Medium / High |
| Loss Flag | Text | Profit < 0 → Yes | Identifies unprofitable orders |
| Order Count | Number | Always 1 | For counting orders in aggregations |

## Calculated Fields (created in Looker Studio)
| Field | Formula | Description |
|---|---|---|
| Average Order Value | SUM(Sales) / SUM(Order Count) | Revenue per order |
| Profit Ratio | SUM(Profit) / SUM(Sales) | Aggregate profitability percentage |
| Month | MONTH(Order Date) | Month number for YoY comparison |