# Query parser

@comodinx/query-parser is a module for parser query parameters on ORM object (sequelize).

## Index

* [Download & Install][install].
* [How is it used?][how_is_it_used].
* [Tests][tests].

## Download & Install

### NPM
```bash
$ npm install @comodinx/query-parser
```

### Source code
```bash
$ git clone https://github.com/comodinx/query-parser.git
$ cd query-parser
$ npm i
```

## How is it used?

This section was designed to facilitate the interpretation of query parameters.

## **What parameters are accepted?**  

### **Pagination**  

| Name     | Type   | Default Value | Description                                         |
|:---------|:-------|:--------------|:----------------------------------------------------|
| page     | number | `1`           | Indicates which page of the list should be returned. |
| pageSize | number | `null`        | Indicates the number of records per page.          |  

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

### **Sorting**  

| Name   | Type   | Default Value | Description                                        |
|:-------|:-------|:--------------|:---------------------------------------------------|
| order  | string | `null`        | Sorting to apply in the search results.           |
|        |        |               | Example,                                          |
|        |        |               | `createdAt-DESC`                                  |  

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

### **Grouping**  

| Name   | Type   | Default Value | Description                                         |
|:-------|:-------|:--------------|:----------------------------------------------------|
| group  | string | `null`        | Grouping to apply in the search results.           |
|        |        |               | Example,                                           |
|        |        |               | `platform`                                         |  

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

### **Filtering**  

| Name    | Type   | Default Value | Description                                          |
|:--------|:-------|:--------------|:-----------------------------------------------------|
| filters | string | `null`        | Filters to apply in the search.                     |
|         |        |               | All table fields are applicable for filtering.      |
|         |        |               | Example,                                            |
|         |        |               | `statusId eq 1`                                     |  

> 💡 For more details on how filters work and their syntax, [check this link](https://www.npmjs.com/package/@comodinx/query-filters).  

> ℹ️ The `ee` (exact equal) operator compares the value as-is: it is not converted to number, boolean or wildcard, and it is always sent to the database as a bound value. Example, `code ee 0010` matches the string `"0010"`.  

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

### **Relationships**  

| Name    | Type   | Default Value | Description                                         |
|:--------|:-------|:--------------|:----------------------------------------------------|
| include | string | `null`        | Relationships to include in the search results.    |
|         |        |               | Example,                                           |
|         |        |               | `status,r-products`                                |  

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

### **Fields**  

| Name   | Type   | Default Value | Description                                         |
|:-------|:-------|:--------------|:----------------------------------------------------|
| fields | string | `"*"`         | Fields to include in the search results.           |
|        |        |               | Example,                                           |
|        |        |               | `id,statusId`                                      |  

Aggregate functions use the `FUNCTION-field[-alias]` syntax (Ex. `COUNT-id-total`). Only `COUNT`, `SUM`, `MIN`, `MAX` and `AVG` are allowed (case-insensitive). Any other function throws a `QueryParserError` with code `INVALID_FIELD_FUNCTION`; map it to a `400 Bad Request` in your API.  

```ts
import { parseQuery, QueryParserError } from "@comodinx/query-parser";

try {
  const options = parseQuery(req.query);
} catch (error) {
  if (error instanceof QueryParserError) {
    // respond 400 Bad Request
  }
  throw error;
}
```

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

### **Extras**  

| Name   | Type   | Default Value | Description                                         |
|:-------|:-------|:--------------|:----------------------------------------------------|
| extras | string | `null`        | Additional fields to include in the search results. |
|        |        |               | Example,                                           |
|        |        |               | `category,brand`                                   |  

<hr/>  
<p align="right">(<a href="#top">go to top</a>)</p>  

## **Tests**  

For more concrete examples, **I INVITE YOU TO CHECK THE TESTS :)**  

### **Run unit tests**  
```sh
npm test
```  

<p align="right">(<a href="#top">go to top</a>)</p>  


<!-- deep links -->
[install]: #download--install
[how_is_it_used]: #how-is-it-used
[tests]: #tests
