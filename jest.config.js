module.exports = {
    verbose: true,    
    "roots" : [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest", 
        "^.+\\.tsx?$": "ts-jest"
    },    
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
      ]
}
