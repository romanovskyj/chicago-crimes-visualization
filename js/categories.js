drawCategories = (crimeType) => {
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
  
  d3.select("#svg-categories").remove();
  let svg = d3.select('#categories-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'svg-categories')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.csv('data/categories_count.csv', (error, data) => {

    const keys = _.keys(data[0]);
    const crimeTypes = _.without(keys, 'year');

    data.forEach((row) => {
      
      row.year = parseDate(row.year);
      crimeTypes.forEach((type) => {
        row[type] = +row[type];
      });
    });

    x.domain(data.map((row) => row.year));
    y.domain([0, d3.max(data, (row) => row[crimeType])]);

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
        .style('text-anchor', 'end');

    svg.selectAll('bar')
        .data(data)
      .enter().append('rect')
        .style('fill', 'steelblue')
        .attr('x', (row) => x(row.year))
        .attr('width', x.rangeBand())
        .attr('y', (barElement) => y(barElement[crimeType]))
        .attr('height', function(d) { return height - y(d[crimeType]); });
  });
}