import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data={ };
  encodemyData:string;
	encodedData:{};

  option:BarcodeScannerOptions ;
  constructor(public navCtrl: NavController,public barcodeScanner:BarcodeScanner) {

  }

  scan(){

    this.option = {

      prompt: "Please scan your code"
    }
    this.barcodeScanner.scan(this.option).then((barcodeData) => {
      // Success! Barcode data is here
      console.log(barcodeData);
      this.data = barcodeData;


     }, (err) => {
         // An error occurred
         console.log(err);
     });

  }





}	