var nbaTeams = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: 'data/nba.json'
});
 
var nhlTeams = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: 'data/nhl.json'
});
 
nbaTeams.initialize();
nhlTeams.initialize();
 
$('#multiple-datasets .typeahead').typeahead({
  highlight: true
},
{
  name: 'nba-teams',
  displayKey: 'team',
  source: nbaTeams.ttAdapter(),
  templates: {
    header: '<h4 class="league-name">Internal Search</h4>'
  }
},
{
  name: 'nhl-teams',
  displayKey: 'team',
  source: nhlTeams.ttAdapter(),
  templates: {
    header: '<h4 class="league-name">External Search</h4>'
  }
});