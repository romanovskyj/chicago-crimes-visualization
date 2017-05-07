draw = (arrested_filter=false) => {
  const y_variable = (arrested_filter) ? 'arrested' : 'total';

  let margin = { top: 0, right: 20, bottom: 70, left:100 };
  let width = 500 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;

  let parseDate = d3.time.format('%Y').parse;

  let x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  let y = d3.scale.linear().range([height, 0]);

  let xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(d3.time.format('%Y'));

  let yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);
  d3.select("svg").remove();
  let svg = d3.select('#year-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.csv('chicago_crimes_parsed.csv', (error, data) => {
    data.forEach((row) => {
      row.year = parseDate(row.year);
    });

    x.domain(data.map((row) => row.year));
    y.domain([0, d3.max(data, (row) => row[y_variable])]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)' );

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Value ($)');

    svg.selectAll('bar')
        .data(data)
      .enter().append('rect')
        .style('fill', 'steelblue')
        .attr('x', (row) => x(row.year))
        .attr('width', x.rangeBand())
        .attr('y', (bar_element) => y(bar_element[y_variable]))
        .attr('height', function(d) { return height - y(d[y_variable]); });
  });
}