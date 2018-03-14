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
  theme: string;

  constructor(public navCtrl: NavController, private storage: Storage,
              private admob: AdMobFree) {
    storage.get('theme').then( val => {
      if(val) {
        this.theme = val;
      } else {
        this.theme = 'classic';
      }
    });
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

  changeTheme(currentTheme) {
    let themes = ['classic', 'night', 'forest', 'mint', 'sport', 'camo'];
    let currentIdx = themes.indexOf(currentTheme);
    if(currentIdx == themes.length-1) {
      this.theme = themes[0];
    } else {
      this.theme = themes[currentIdx+1];
    }
    this.storage.set('theme', this.theme);
  }

}
