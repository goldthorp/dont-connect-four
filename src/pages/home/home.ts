import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  board: any;
  color = 'red';
  playerWins = 0;
  computerWins = 0;

  constructor(public navCtrl: NavController, private storage: Storage,
              private admob: AdMobFree) {
    storage.get('playerWins').then( val => {
      if(val) {
        this.playerWins = val;
      }
    });
    storage.get('computerWins').then( val => {
      if(val) {
        this.computerWins = val;
      }
    });
  }

  ionViewDidEnter() {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-3456785009528609/9578737045',
      isTesting: false,
      autoShow: true
    };
    this.admob.banner.config(bannerConfig);
    this.admob.banner.prepare().catch(e => console.log(e));
  }

  startNewGame() {
    this.navCtrl.push('BoardPage');
  }


}
