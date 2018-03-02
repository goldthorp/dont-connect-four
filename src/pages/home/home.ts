import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  board: any;
  color = 'red'
  level: number;

  constructor(public navCtrl: NavController, private storage: Storage,
              private admob: AdMobFree) {
    storage.get('level').then( val => {
      if(val) {
        this.level = val;
      } else {
        this.level = 1;
      }
      this.initBoard();
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

  // initBoard() {
  //   this.board = new Array(6).fill(null).map(i => new Array(7).fill('empty'));
  //   for(let i = 0; i < this.level; i++) {
  //     this.newMove(Math.floor(Math.random()*7))
  //   }
  //   if(!this.checkWorkable()) {
  //     this.initBoard();
  //   }
  // }

  newMove(cellIdx) {
    if(this.board[0][cellIdx] === 'empty') {
      let rowIdx: number;
      for(let i = 0; i < 6; i++) {
        if(this.board[i][cellIdx] !== 'empty') {
          rowIdx = i-1;
          break;
        } else if(i == 5) {
          rowIdx = i;
        }
      }
      this.board[rowIdx][cellIdx] = this.color;
      let check = this.checkFour(rowIdx, cellIdx);
      if(check) {
        this.clearBoard(check);
      }
      // if(rowIdx == 0) {
      //   if(this.checkFull()) {
      //     this.nextLevel();
      //   }
      // }
      this.changeColor();
    }
  }

  changeColor() {
    if(this.color === 'red') {
      this.color = 'yellow';
    } else {
      this.color = 'red';
    }
  }

  checkFour(i, j) {
    let store = [];
    if(i <= 2) {
      for(let inc = 0; inc <= 3; inc++) {
        if(this.board[i][j] === this.board[i+inc][j]) {
          store.push([i+inc, j]);
          if(store.length == 4) {
            return store;
          }
        }
      }
    }
    for(let b = -3; b <= 0; b++) {
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(this.board[i][j] === this.board[i][j+inc]) {
          store.push([i, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(this.board[i+inc] && this.board[i][j] === this.board[i+inc][j+inc]) {
          store.push([i+inc, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(this.board[i-inc] && this.board[i][j] === this.board[i-inc][j+inc]) {
          store.push([i-inc, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
    }
  }

  clearBoard(run) {
    let color = this.board[run[0][0]][run[0][1]];
    this.board = new Array(6).fill(null).map(i => new Array(7).fill('empty'));
    for(let c of run) {
      this.board[c[0]][c[1]] = color;
    }
  }

  checkFull() {
    for(let i = 0; i < 6; i++) {
      if(this.board[i].indexOf('empty') != -1) {
        return false;
      }
    }
    return true;
  }

  nextLevel() {
    this.level++;
    this.storage.set('level', this.level);
    if(this.level%2 == 1) {
      const interstitialConfig: AdMobFreeInterstitialConfig = {
        id: 'ca-app-pub-3456785009528609/7307796920',
        isTesting: false,
        autoShow: true
      };
      this.admob.interstitial.config(interstitialConfig);
      this.admob.interstitial.prepare().then( () => {
        this.initBoard();
      }).catch(e => console.log(e));
    } else {
      this.initBoard();
    }

  }

  checkWorkable() {
    for(let j = 0; j < 7; j++) {
      let above = false;
      for(let i = 0; i < 6; i++) {
        if(this.board[i][j] !== 'empty') {
          above = true;
        } else if(above) {
          return false;
        }
      }
    }
    return true;
  }

}
