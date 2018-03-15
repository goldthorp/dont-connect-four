import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from "../home/home";
import { AdMobFree, AdMobFreeInterstitialConfig } from "@ionic-native/admob-free";


@IonicPage()
@Component({
  selector: 'page-board',
  templateUrl: 'board.html',
})
export class BoardPage {

  board: any;
  active = 'player';
  animating = -1;
  animateClass: string;
  theme: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              private storage: Storage, private admob: AdMobFree) {
    storage.get('theme').then( val => {
      if(val) {
        this.theme = val;
      } else {
        this.theme = 'classic';
      }
    });
    this.initBoard();
  }

  initBoard() {
    this.board = new Array(6).fill(null).map(i => new Array(7).fill('empty'));
  }

  quitGame() {
    let alert = this.alertCtrl.create({
      title: 'End Game?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.pop().catch( () => {
              this.navCtrl.setRoot(HomePage);
            });
          }
        }
      ]
    });
    alert.present();
  }

  newMove(cellIdx) {
    if(this.animating == -1 && !this.wait && this.board[0][cellIdx] === 'empty') {
      let rowIdx = this.getRowIdx(cellIdx);
      this.dropPiece(rowIdx, cellIdx, this.active).then( () => {
        let check = this.checkFour(this.board, rowIdx, cellIdx);
        if(check) {
          this.clearBoard(check);
          this.gameOver();
        } else {
          this.continueGame();
        }
      });
    }
  }

  getRowIdx(cellIdx) {
    let rowIdx: number;
    for(let i = 0; i < 6; i++) {
      if(this.board[i][cellIdx] !== 'empty') {
        rowIdx = i-1;
        break;
      } else if(i == 5) {
        rowIdx = i;
      }
    }
    return rowIdx;
  }

  dropPiece(rowIdx, cellIdx, active) {
    return new Promise<null>( resolve => {
      this.animating = cellIdx;
      let animateClasses = ['animate-disc1', 'animate-disc2', 'animate-disc3', 'animate-disc4', 'animate-disc5', 'animate-disc6'];
      this.animateClass = animateClasses[rowIdx];
      let delay = rowIdx == 0 ? 1 : rowIdx;
      setTimeout( () => {
        this.animating = -1;
        this.board[rowIdx][cellIdx] = active;
        resolve();
      }, 83*delay);
    });

  }

  wait = false;

  continueGame() {
    if(this.active === 'player') {
      this.wait = true;
      setTimeout( () => {
        this.wait = false;
        this.active = 'computer';
        this.computerMove();
      }, 150);
    } else if(this.board[0].indexOf('empty') == -1) {
      this.tieGame();
    } else {
      this.active = 'player';
    }
  }


  computerMove() {
    let possibleMoves = this.getPossibleMoves();
    for(let i = 2; i >= 0; i--) {
      let moves = possibleMoves[i].map(i => i[1]);
      if(moves.length != 0) {
        let r = Math.floor(Math.random()*moves.length);
        this.newMove(moves[r]);
        break;
      }
    }
  }

  getPossibleMoves(): any {
    let possibleMoves = { 0: [], 1: [], 2: [] };
    for(let i = 0; i < 7; i++) {
      if(this.board[0][i] === 'empty') {
        switch(this.getMoveRank(i)) {
          case 0:
            possibleMoves[0].push([this.getRowIdx(i), i]);
            break;
          case 1:
            possibleMoves[1].push([this.getRowIdx(i), i]);
            break;
          case 2:
            possibleMoves[2].push([this.getRowIdx(i), i]);
        }
      }
    }
    return possibleMoves;
  }

  getMoveRank(cellIdx): number {
    let board = new Array(6).fill(null).map((_, i) => new Array(7).fill(null).map((_, j) => this.board[i][j]));
    let rowIdx = this.getRowIdx(cellIdx);
    board[rowIdx][cellIdx] = 'computer';
    if(this.checkFour(board, rowIdx, cellIdx)) {
      return 0;
    }
    board[rowIdx][cellIdx] = 'player';
    if(this.checkFour(board, rowIdx, cellIdx)) {
      return 1;
    }
    return 2;
  }



  checkFour(board, i, j) {
    let store = [];
    if(i <= 2) {
      for(let inc = 0; inc <= 3; inc++) {
        if(board[i][j] === board[i+inc][j]) {
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
        if(board[i][j] === board[i][j+inc]) {
          store.push([i, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(board[i+inc] && board[i][j] === board[i+inc][j+inc]) {
          store.push([i+inc, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(board[i-inc] && board[i][j] === board[i-inc][j+inc]) {
          store.push([i-inc, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
    }
  }

  clearBoard(run) {
    let active = this.board[run[0][0]][run[0][1]];
    this.board = new Array(6).fill(null).map(i => new Array(7).fill('empty'));
    for(let c of run) {
      this.board[c[0]][c[1]] = active;
    }
  }

  gameOver() {
    if(this.active == 'computer') {
      this.storage.get('playerWins').then( val => {
        if(val) {
          this.storage.set('playerWins', val+1);
        } else {
          this.storage.set('playerWins', 1);
        }
        alert.present();
      });
      let alert = this.alertCtrl.create({
        title: 'You Win!',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.showInterstitialAd().then( () => {
                this.navCtrl.setRoot(HomePage);
              });
            }
          }
        ],
        enableBackdropDismiss: false
      });
    } else if(this.active = 'player') {
      this.storage.get('computerWins').then( val => {
        if(val) {
          this.storage.set('computerWins', val+1);
        } else {
          this.storage.set('computerWins', 1);
        }
        alert.present();
      });
      let alert = this.alertCtrl.create({
        title: 'You Lose',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.showInterstitialAd().then( () => {
                this.navCtrl.setRoot(HomePage);
              });
            }
          }
        ],
        enableBackdropDismiss: false
      });
    }
  }

  tieGame() {
    let alert = this.alertCtrl.create({
      title: 'Tie Game',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.showInterstitialAd().then( () => {
              this.navCtrl.setRoot(HomePage);
            });
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  showInterstitialAd() {
    return new Promise<null>( resolve => {
      const bannerConfig: AdMobFreeInterstitialConfig = {
        id: 'ca-app-pub-3456785009528609/7307796920',
        isTesting: false,
        autoShow: true
      };
      this.admob.interstitial.config(bannerConfig);
      this.admob.interstitial.prepare().then( () => {
        resolve();
      }).catch(e => console.log(e));
    });
  }

}
