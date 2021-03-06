### Overview
`QueryInfo` is a **R Shiny Module** to facilitate the data access from **OpenFairViewer** map Viewer.
This module include a **URL** query string parsing to produce the data and metadata from **OGC services**.

### Inputs
Pass to the `QueryInfo ` module or Shiny app that make use of `QueryInfo` module in url a list of parameters. 
The declaration of parameters is at the form: `parameterName=parameterValue` and two parameters must be separate by `&`. 

### Outputs
The outputs are Shiny Reactive objects:
* `data`: a datatable spatialized or not with data requested 
* `dsd`: a datatable object with columns definition information from dsd parameters or CSW interrogation
* `query`: a list including all parameters specified in url
* `time`: total computation time information

### Use inside Shiny application

Connect `QueryInfo`in server part of the app to use it. The object assigned to the module is a reactive list including the four outputs items listed above. 

```r
server <- function(input, output, session) {
  source("https://raw.githubusercontent.com/eblondel/OpenFairViewer/master/src/resources/shinyModule/QueryInfo.R")
  query_outputs <- callModule(module = QueryInfo, id = "data")
  
  data <- query_outputs$data #get data
  dsd <- query_outputs$dsd #get dsd
  query <- query_outputs$query #get query
  time <- query_outputs$time #get querying time
  
  ... your business logic ...
}
```

### Summary of parameters usage

 Parameters |Description|Popup <br/> with geom <br/>|Popup <br/> without geom <br/>|Dashboard <br/> with geom <br/>|Dashboard <br/> without geom <br/>|
 -------- |:--|:--:|:--:|:--:|:--:|
 **pid** |*process identifier*|*|*|*|*|
 **layer** |*exact name of layer*|x|x|x|x|
 **strategy** |***ogc_filters** or **ogc_viewparams** if **par** is in parametric SQL View*|x|x|x|x|
 **par** |*basic or parameterized query expressions*|x|x|x|x|
 **feature_geom** |***TRUE** to include geospatialized column **FALSE** to exclude it*|*TRUE*|*FALSE*|*TRUE*|*FALSE*|
 **wfs_server** |*name of WFS server*|x|x|x|x|
 **wfs_version** |*version of WFS server*|x|x|x|x|
 **wms_server** |*name of WMS server*|x|x|||
 **wms_version** |*version of WMS server*|x|x|||
 **csw_server** |*name of CSW server*|*|*|*|*|
 **csw_version** |*version of CSW server*|*|*|*|*|
 **x** |*x coordinate of click position relative to the image*|x|x|||
 **y** |*y coordinate of click position relative to the image*|x|x|||
 **width** |*WMS GetFeatureInfo Tile image width*|x|x|||
 **height** |*WMS GetFeatureInfo Tile image height*|x|x|||
 **bbox** |*bbox with buffer*|x|x|||
 **srs** |*spatial reference system (SRS) or coordinate reference system (CRS), by default **EPSG:4326***|x|x|||
 **dsd** |*columns definitions information as JSON string format* |**|**|**|**|
 
 `x` mandatory parameter
`*` need if dsd parameter not indicate
`**` optional parameter, can be implemented in url for more faster run, otherwise ***dsd*** will be compute automatically since CSW service
 
