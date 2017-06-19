var api = require('../'),
    assert = require('assert');

describe('mapshaper-target.js', function () {

  it('target second of two datasets', function(done) {
    var cmd = "-i test/test_data/three_points.shp -i test/test_data/text/states.csv -target states -o";
    api.applyCommands(cmd, {}, function(err, output) {
      assert('states.csv' in output);
      done();
    })
  })

  it('target layer in first of two datasets by layer number', function(done) {
    var cmd = "-i test/test_data/three_points.shp -i test/test_data/text/states.csv -target 1 -o";
    api.applyCommands(cmd, {}, function(err, output) {
      assert('three_points.shp' in output);
      assert('three_points.dbf' in output);
      assert('three_points.prj' in output);
      done();
    })
  })

  it('target layer in second of two datasets by layer number', function(done) {
    var cmd = "-i test/test_data/three_points.shp -filter true + -i test/test_data/text/states.csv -target 3 -o";
    api.applyCommands(cmd, {}, function(err, output) {
      assert.deepEqual(Object.keys(output), ['states.csv']);
      done();
    })
  })

  it('-target name= option renames target layer', function(done) {
    var cmd = "-i test/test_data/three_points.shp -target 1 name=a -o format=geojson";
    api.applyCommands(cmd, {}, function(err, output) {
      var a = JSON.parse(output['a.json']);
      assert.equal(a.type, 'FeatureCollection');
      done();
    })
  })

  it('error if no layer is matched', function(done) {
    var cmd = "-i test/test_data/three_points.shp -target states";
    api.runCommands(cmd, function(err) {
      assert.equal(err.name, 'APIError');
      done();
    })
  })

  it('error if multiple layers are matched', function(done) {
    var cmd = "-i test/test_data/three_points.shp -i test/test_data/three_points.shp -target three_points";
    api.runCommands(cmd, function(err) {
      assert.equal(err.name, 'APIError');
      done();
    })
  })
})