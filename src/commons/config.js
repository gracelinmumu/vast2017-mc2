// process.SkyEye 可以访问
let config = {
  debug: process.SkyEye.ENV === 'dev',
  monthOpts: [ 'M4', 'M8', 'M12' ],
  factoryOpts: [ 'Roadrunner ', 'Kasios', 'Radiance ', 'Indigo' ],
  chemicalOpts: [ 'Chlorodinine', 'Methylosmolene', 'AGOC-3A', 'Appluimonia' ],
  sensorOpts: [ 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9' ],
  factoriesLoc: {
    'Roadrunner': [ 89, 27 ],
    'Kasios': [ 90, 21 ],
    'Radiance': [ 109, 26 ],
    'Indigo': [ 120, 22 ]
  },
  sensorsLoc: {
    s1: [ 62, 21 ],
    s2: [ 66, 35 ],
    s3: [ 76, 41 ],
    s4: [ 88, 45 ],
    s5: [ 103, 43 ],
    s6: [ 102, 22 ],
    s7: [ 89, 3 ],
    s8: [ 74, 7 ],
    s9: [ 119, 42 ]
  }
}

export default config
