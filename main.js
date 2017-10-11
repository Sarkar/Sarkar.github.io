var client = algoliasearch('IZIZ178186', '68e27258c4cea10d47853b6c3dab5d20');
var helper = algoliasearchHelper(client, 'dev_DENVER_RESTAURANTS_ENRICHED', {
  facets: ['food_types', 'payment_options', 'stars_count']
});

helper.on('result', function(content) {
  renderFacetList(content);
  renderHits(content);
});

function renderHits(content) {
	$('#container').html(function() {
		return $.map(content.hits, function(hit) {
			console.log(hit._highlightResult);
			return '<li><strong>' + hit._highlightResult.name.value + '</strong>' +
			'<div><span>' + hit._highlightResult.stars_count.value + ' (' + hit._highlightResult.reviews_count.value + ' reviews)' + '</span></div>' +
			'<div><span>' + hit._highlightResult.food_types.value + ' | '
			+ hit._highlightResult.neighborhood.value + ' | ' +
			hit._highlightResult.price_range.value + '</span></div>' +
			'</li>';
		});
	});
}

$('#facet-cuisine').on('click', 'input[type=checkbox]', function(e) {
  var facetValue = $(this).data('facet');
  helper.toggleRefinement('food_types', facetValue).search();
});

function renderFacetList(content) {
  $('#facet-cuisine').html(function() {
    return $.map(content.getFacetValues('food_types'), function(facet) {
      var checkbox = $('<input type=checkbox>')
        .data('facet', facet.name)
        .attr('id', 'fl-' + facet.name);
      if(facet.isRefined) checkbox.attr('checked', 'checked');
      var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', 'fl-' + facet.name);
      return $('<li>').append(checkbox).append(label);
    });
  });
  /*$('#facet-payment-option').html(function() {
	return $.map(content.getFacetValues('payment_options'), function(facet) {
	  var checkbox = $('<input type=checkbox>')
		.data('facet', facet.name)
		.attr('id', 'fl-' + facet.name);
	  if(facet.isRefined) checkbox.attr('checked', 'checked');
	  var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
							  .attr('for', 'fl-' + facet.name);
	  return $('<li>').append(checkbox).append(label);
	});
});*/
}

$('#search-box').on('keyup', function() {
  helper.setQuery($(this).val())
        .search();
});

helper.search();
