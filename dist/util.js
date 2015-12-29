'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateProfiles = generateProfiles;
exports.urlEncode = urlEncode;
var bannedChars = {
  '%': '%25',
  '.': '%2E',
  '/': '%2F',
  '\\': '%5C',
  '?': '%3F',
  '*': '%2A',
  ':': '%3A',
  '|': '%7C',
  '<': '%3C',
  '>': '%3E',
  '$': '%24',
  '@': '%40',
  ',': '%2C'
};

function generateProfiles() {
  var map = {};

  for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
    nodes[_key] = arguments[_key];
  }

  nodes.forEach(function (node) {
    map[node.profileName] = node.factory;
  });

  return map;
}

function urlEncode(string) {
  Object.keys(bannedChars).forEach(function (char) {
    string = string.split(char).join(bannedChars[char]);
  });

  return string;
}