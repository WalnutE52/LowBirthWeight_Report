"use strict";

// Generated by CoffeeScript 2.5.1
// iboxplot.coffee

// Top panel is like a set of n box plots:
//   lines are drawn at the 0.1, 1, 10, 25, 50, 75, 90, 99, 99.9 percentiles
//   for each of n distributions
// Hover over a column in the top panel and the corresponding distribution
//   is show below; click for it to persist; click again to make it go away.

var iboxplot;

iboxplot = function iboxplot(widgetdiv, data, chartOpts) {
  var Baxis, BaxisData, Laxis, LaxisData, botylim, br2, chartdivid, clickStatus, color, curves, d, fix4hist, grp4BkgdHist, halfheight, height, hi, hist, histcolors, histline, i, indRect, indRectGrp, indindex, j, k, l, len, len1, len2, len3, lo, longRect, longRectGrp, lowBaxis, lowBaxisData, lowsvg, lowxScale, lowyScale, m, margin, midQuant, n, nQuant, o, p, qucolors, quline, r, randomInd, recWidth, rectcolor, ref, ref1, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, rightAxis, svg, tmp, tooltip, topylim, widgetdivid, width, xScale, xlab, yScale, ylab;
  // chartOpts start
  width = (ref = chartOpts != null ? chartOpts.width : void 0) != null ? ref : 1000; // width of image in pixels
  height = (ref1 = chartOpts != null ? chartOpts.height : void 0) != null ? ref1 : 900; // total height of image in pixels
  margin = (ref2 = chartOpts != null ? chartOpts.margin : void 0) != null ? ref2 : {
    left: 60,
    top: 20,
    right: 60,
    bottom: 40 // margins in pixels (left, top, right, bottom)
  };
  ylab = (ref3 = chartOpts != null ? chartOpts.ylab : void 0) != null ? ref3 : "Response"; // y-axis label
  xlab = (ref4 = chartOpts != null ? chartOpts.xlab : void 0) != null ? ref4 : "Individuals"; // x-axis label
  rectcolor = (ref5 = chartOpts != null ? chartOpts.rectcolor : void 0) != null ? ref5 : "#E6E6E6"; // color of background rectangle
  qucolors = (ref6 = chartOpts != null ? chartOpts.qucolors : void 0) != null ? ref6 : null; // vector of colors for the quantile curves
  histcolors = (ref7 = chartOpts != null ? chartOpts.histcolors : void 0) != null ? ref7 : ["#0074D9", "#FF4136", "#3D9970", "MediumVioletRed", "black" // vector of colors for selected histograms
  ];
  // chartOpts end
  chartdivid = (ref8 = chartOpts != null ? chartOpts.chartdivid : void 0) != null ? ref8 : 'chart';
  widgetdivid = d3.select(widgetdiv).attr('id');
  // make sure list args have all necessary bits
  margin = d3panels.check_listarg_v_default(margin, {
    left: 60,
    top: 20,
    right: 60,
    bottom: 40
  });
  // make sure histcolors and qucolors are arrays
  histcolors = d3panels.forceAsArray(histcolors);
  qucolors = d3panels.forceAsArray(qucolors);
  halfheight = height / 2;
  // y-axis limits for top figure
  topylim = [data.quant[0][0], data.quant[0][0]];
  for (i in data.quant) {
    r = d3.extent(data.quant[i]);
    if (r[0] < topylim[0]) {
      topylim[0] = r[0];
    }
    if (r[1] > topylim[1]) {
      topylim[1] = r[1];
    }
  }
  topylim[0] = Math.floor(topylim[0]);
  topylim[1] = Math.ceil(topylim[1]);
  // y-axis limits for bottom figure
  botylim = [0, data.counts[0][0]];
  for (i in data.counts) {
    m = d3.max(data.counts[i]);
    if (m > botylim[1]) {
      botylim[1] = m;
    }
  }
  indindex = d3.range(data.ind.length);
  // adjust counts object to make proper histogram
  br2 = [];
  ref9 = data.breaks;
  for (k = 0, len = ref9.length; k < len; k++) {
    i = ref9[k];
    br2.push(i);
    br2.push(i);
  }
  fix4hist = function fix4hist(d) {
    var l, len1, x;
    x = [0];
    for (l = 0, len1 = d.length; l < len1; l++) {
      i = d[l];
      x.push(i);
      x.push(i);
    }
    x.push(0);
    return x;
  };
  for (i in data.counts) {
    data.counts[i] = fix4hist(data.counts[i]);
  }
  // number of quantiles
  nQuant = data.quant.length;
  midQuant = (nQuant + 1) / 2 - 1;
  // x and y scales for top figure
  xScale = d3.scaleLinear().domain([-1, data.ind.length]).range([margin.left, width - margin.right]);
  // width of rectangles in top panel
  recWidth = xScale(1) - xScale(0);
  yScale = d3.scaleLinear().domain(topylim).range([halfheight - margin.bottom, margin.top]);
  // function to create quantile lines
  quline = function quline(j) {
    return d3.line().x(function (d) {
      return xScale(d);
    }).y(function (d) {
      return yScale(data.quant[j][d]);
    });
  };
  svg = d3.select(widgetdiv).select("svg").append("svg").attr("width", width).attr("height", halfheight).attr("class", "qtlcharts");
  // gray background
  svg.append("rect").attr("x", margin.left).attr("y", margin.top).attr("height", halfheight - margin.top - margin.bottom).attr("width", width - margin.left - margin.right).attr("stroke", "none").attr("fill", rectcolor).attr("pointer-events", "none");
  // axis on left
  LaxisData = yScale.ticks(6);
  Laxis = svg.append("g").attr("id", "Laxis");
  // axis: white lines
  Laxis.append("g").selectAll("empty").data(LaxisData).enter().append("line").attr("class", "line").attr("class", "axis").attr("x1", margin.left).attr("x2", width - margin.right).attr("y1", function (d) {
    return yScale(d);
  }).attr("y2", function (d) {
    return yScale(d);
  }).attr("stroke", "white").attr("pointer-events", "none");
  // axis: labels
  Laxis.append("g").selectAll("empty").data(LaxisData).enter().append("text").attr("class", "axis").text(function (d) {
    return d3panels.formatAxis(LaxisData)(d);
  }).attr("x", margin.left * 0.9).attr("y", function (d) {
    return yScale(d);
  }).attr("dominant-baseline", "middle").attr("text-anchor", "end");
  // axis on bottom
  BaxisData = xScale.ticks(10);
  Baxis = svg.append("g").attr("id", "Baxis");
  // axis: white lines
  Baxis.append("g").selectAll("empty").data(BaxisData).enter().append("line").attr("class", "line").attr("class", "axis").attr("y1", margin.top).attr("y2", halfheight - margin.bottom).attr("x1", function (d) {
    return xScale(d - 1);
  }).attr("x2", function (d) {
    return xScale(d - 1);
  }).attr("stroke", "white").attr("pointer-events", "none");
  // axis: labels
  Baxis.append("g").selectAll("empty").data(BaxisData).enter().append("text").attr("class", "axis").text(function (d) {
    return d;
  }).attr("y", halfheight - margin.bottom * 0.75).attr("x", function (d) {
    return xScale(d - 1);
  }).attr("dominant-baseline", "middle").attr("text-anchor", "middle");
  // colors for quantile curves
  if (qucolors != null && qucolors.length < (nQuant - 1) / 2 + 1) {
    displayError("Not enough quantile colors: " + qucolors.length + " but need " + ((nQuant - 1) / 2 + 1), "error_" + chartdivid);
    qucolors = null;
  }
  if (qucolors == null) {
    tmp = d3.schemeCategory10;
    qucolors = ["black"];
    ref10 = d3.range((nQuant - 1) / 2);
    for (l = 0, len1 = ref10.length; l < len1; l++) {
      j = ref10[l];
      qucolors.push(tmp[j]);
    }
  }
  if (qucolors.length > (nQuant - 1) / 2 + 1) {
    qucolors = qucolors.slice(0, (nQuant - 1) / 2 + 1);
  }
  qucolors = qucolors.reverse();
  ref11 = qucolors.slice(0, -1).reverse();
  for (n = 0, len2 = ref11.length; n < len2; n++) {
    color = ref11[n];
    qucolors.push(color);
  }
  // curves for quantiles
  curves = svg.append("g").attr("id", "curves");
  for (j = o = 0, ref12 = nQuant; 0 <= ref12 ? o < ref12 : o > ref12; j = 0 <= ref12 ? ++o : --o) {
    curves.append("path").datum(indindex).attr("d", quline(j)).attr("class", "line").attr("stroke", qucolors[j]).attr("pointer-events", "none").attr("fill", "none");
  }
  // vertical rectangles representing each array
  indRectGrp = svg.append("g").attr("id", "indRect");
  indRect = indRectGrp.selectAll("empty").data(indindex).enter().append("rect").attr("x", function (d) {
    return xScale(d) - recWidth / 2;
  }).attr("y", function (d) {
    return yScale(data.quant[nQuant - 1][d]);
  }).attr("id", function (d) {
    return "rect" + data.ind[d];
  }).attr("width", recWidth).attr("height", function (d) {
    return yScale(data.quant[0][d]) - yScale(data.quant[nQuant - 1][d]);
  }).attr("fill", "purple").attr("stroke", "none").attr("opacity", "0").attr("pointer-events", "none");
  // vertical rectangles representing each array
  longRectGrp = svg.append("g").attr("id", "longRect");
  longRect = indRectGrp.selectAll("empty").data(indindex).enter().append("rect").attr("x", function (d) {
    return xScale(d) - recWidth / 2;
  }).attr("y", margin.top).attr("width", recWidth).attr("height", halfheight - margin.top - margin.bottom).attr("fill", "purple").attr("stroke", "none").attr("opacity", "0");
  // label quantiles on right
  rightAxis = svg.append("g").attr("id", "rightAxis");
  rightAxis.selectAll("empty").data(data.qu).enter().append("text").attr("class", "qu").text(function (d) {
    return d * 100 + "%";
  }).attr("x", width).attr("y", function (d, i) {
    return yScale(((i + 0.5) / nQuant / 2 + 0.25) * (topylim[1] - topylim[0]) + topylim[0]);
  }).attr("fill", function (d, i) {
    return qucolors[i];
  }).attr("text-anchor", "end").attr("dominant-baseline", "middle");
  // box around the outside
  svg.append("rect").attr("x", margin.left).attr("y", margin.top).attr("height", halfheight - margin.top - margin.bottom).attr("width", width - margin.left - margin.right).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
  // lower svg
  lowsvg = d3.select(widgetdiv).select("svg").append("g").attr("id", "lower_svg").attr("transform", "translate(0," + halfheight + ")").append("svg").attr("height", halfheight).attr("width", width).attr("class", "qtlcharts");
  lo = data.breaks[0] - (data.breaks[1] - data.breaks[0]);
  hi = data.breaks[data.breaks.length - 1] + (data.breaks[1] - data.breaks[0]);
  lowxScale = d3.scaleLinear().domain([lo, hi]).range([margin.left, width - margin.right]);
  lowyScale = d3.scaleLinear().domain([0, botylim[1] + 1]).range([halfheight - margin.bottom, margin.top]);
  // gray background
  lowsvg.append("rect").attr("x", margin.left).attr("y", margin.top).attr("height", halfheight - margin.top - margin.bottom).attr("width", width - margin.left - margin.right).attr("stroke", "none").attr("fill", rectcolor);
  // axis on left
  lowBaxisData = lowxScale.ticks(8);
  lowBaxis = lowsvg.append("g").attr("id", "lowBaxis");
  // axis: white lines
  lowBaxis.append("g").selectAll("empty").data(lowBaxisData).enter().append("line").attr("class", "line").attr("class", "axis").attr("y1", margin.top).attr("y2", halfheight - margin.bottom).attr("x1", function (d) {
    return lowxScale(d);
  }).attr("x2", function (d) {
    return lowxScale(d);
  }).attr("stroke", "white");
  // axis: labels
  lowBaxis.append("g").selectAll("empty").data(lowBaxisData).enter().append("text").attr("class", "axis").text(function (d) {
    return d3panels.formatAxis(lowBaxisData)(d);
  }).attr("y", halfheight - margin.bottom * 0.75).attr("x", function (d) {
    return lowxScale(d);
  }).attr("dominant-baseline", "middle").attr("text-anchor", "middle");
  grp4BkgdHist = lowsvg.append("g").attr("id", "bkgdHist");
  histline = d3.line().x(function (d, i) {
    return lowxScale(br2[i]);
  }).y(function (d) {
    return lowyScale(d);
  });
  randomInd = indindex[Math.floor(Math.random() * data.ind.length)];
  hist = lowsvg.append("path").datum(data.counts[randomInd]).attr("d", histline).attr("id", "histline").attr("fill", "none").attr("stroke", "purple").attr("stroke-width", "2");
  clickStatus = [];
  for (p = 0, len3 = indindex.length; p < len3; p++) {
    d = indindex[p];
    clickStatus.push(0);
  }
  longRect.on("mouseover", function (event, d) {
    d3.select("rect#rect" + data.ind[d]).attr("opacity", "1");
    return d3.select("#histline").datum(data.counts[d]).attr("d", histline);
  }).on("mouseout", function (event, d) {
    if (!clickStatus[d]) {
      return d3.select("rect#rect" + data.ind[d]).attr("opacity", "0");
    }
  }).on("click", function (event, d) {
    var curcolor;
    clickStatus[d] = 1 - clickStatus[d];
    d3.select("rect#rect" + data.ind[d]).attr("opacity", clickStatus[d]);
    if (clickStatus[d]) {
      curcolor = histcolors.shift();
      histcolors.push(curcolor);
      d3.select("rect#rect" + data.ind[d]).attr("fill", curcolor);
      return grp4BkgdHist.append("path").datum(data.counts[d]).attr("d", histline).attr("id", "path" + data.ind[d]).attr("fill", "none").attr("stroke", curcolor).attr("stroke-width", "2");
    } else {
      return d3.select("path#path" + data.ind[d]).remove();
    }
  });
  tooltip = d3panels.tooltip_create(d3.select(widgetdiv), indRectGrp.selectAll("rect"), {
    tipclass: widgetdivid
  }, function (d) {
    return data.ind[d];
  });
  // box around the outside
  lowsvg.append("rect").attr("x", margin.left).attr("y", margin.top).attr("height", halfheight - margin.bottom - margin.top).attr("width", width - margin.left - margin.right).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
  svg.append("text").text(ylab).attr("x", margin.left * 0.2).attr("y", halfheight / 2).attr("fill", "slateblue").attr("transform", "rotate(270 " + margin.left * 0.2 + " " + halfheight / 2 + ")").attr("dominant-baseline", "middle").attr("text-anchor", "middle");
  lowsvg.append("text").text(ylab).attr("x", (width - margin.left - margin.bottom) / 2 + margin.left).attr("y", halfheight - margin.bottom * 0.2).attr("fill", "slateblue").attr("dominant-baseline", "middle").attr("text-anchor", "middle");
  svg.append("text").text(xlab).attr("x", (width - margin.left - margin.bottom) / 2 + margin.left).attr("y", halfheight - margin.bottom * 0.2).attr("fill", "slateblue").attr("dominant-baseline", "middle").attr("text-anchor", "middle");
  if (chartOpts.heading != null) {
    d3.select("div#htmlwidget_container").insert("h2", ":first-child").html(chartOpts.heading).style("font-family", "sans-serif");
  }
  if (chartOpts.caption != null) {
    d3.select("body").append("p").attr("class", "caption").html(chartOpts.caption);
  }
  if (chartOpts.footer != null) {
    return d3.select("body").append("div").html(chartOpts.footer).style("font-family", "sans-serif");
  }
};