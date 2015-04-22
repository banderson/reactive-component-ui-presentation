#  <em class="highlight">(Ab)Using Context</em>
<div>
    <pre style="float: left; width: 50%; text-align: center; font-size: 100%">
+-------------+
|   Parent    |
+-------------+
       |       
       |       
     .....     
       |       
       |       
+-------------+
|    Child    |
+-------------+</pre>
    <pre class="fragment" style="float: right; width: 50%; text-align: center; font-size: 100%">
+-------------+
|   Parent    |
+------+------+
|
+------+------+
|update: false|
+------+------+
|
+------+------+
|    Child    |
+-------------+</pre>
</div>
<br style="clear: both">
<div style="float: left; width: 50%; font-weight: bold">All Good</div>
<div style="float: right; width: 50%; color: red; font-weight: bold" class="fragment">Completely Broken</div>
