import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {
    // let loader = new Loader({
    //   apiKey: 'AIzaSyCQ8jm0B2a4PEgCVTs8djf9viUib10Wpmk'
    // });

    // loader.load().then(() => {
    //   new google.maps.Map(document.getElementById("map") as HTMLElement, {
    //     center: {lat: 51.233334, lng: 6.78333},
    //     zoom: 6
    //   })
    // })
  }
}
