## Map Maker App

This app use google-maps-react library, to wrap around Google Maps API and to use Google Maps components as React components.

Maps is initially loaded in Nis. Clicking on the map it creates marker with id, position and color property. Markers is stored in localStorage as well as mapCenter.

By clicking on marker it randomly change a color. With SHIFT + click it shows info window with position on the map and to delete a marker you can use CTRL + click.

On the bottom there is a textarea where we can add markers as comma seperated values of latitude,longitude,color:

for example:
```
65.4321,82.3211,yellow
15.34534,32.54324,blue
......................
```

You can see demo on: [Map Maker App](http://map-maker-react.s3-website.eu-central-1.amazonaws.com)