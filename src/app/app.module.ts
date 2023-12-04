import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheModule } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from '@angular/fire';
import { SuperTabsModule } from 'ionic2-super-tabs';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { MyApp } from './app.component';
import { AuthenticationService } from '../providers/authentication/authentication.service';
import { RestaurantService } from '../providers/restaurant/restaurant.service';
import { FcmService } from '../providers/fcm/fcm.service';
import { NotificationService } from '../providers/notification/notification.service';
import { FeedbackService } from '../providers/feedback/feedback.service';
import { ToggleService } from '../providers/toggle/toggle.service';
import { OrderService } from '../providers/order/order.service';
import { CommonService } from '../providers/common/common.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { JwtInterceptor } from '../interceptors/jwt-interceptor';
import { TokenService } from '../providers/authentication/token.service';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../providers/environments/environments';
import { RetryService } from '../providers/common/retry.service';
import { Vibration } from '@ionic-native/vibration';
import { DataService } from './../providers/data-service/data-service';
import { NativeAudio } from '@ionic-native/native-audio';
import { SoundService } from '../providers/common/sound.service';

const firebaseConfig = {
  apiKey: 'AIzaSyCwP-fqSkd5sTXPoiCJouhJ3DsTAE_6vcE',
  authDomain: 'ilovou-studio.firebaseapp.com',
  databaseURL: 'https://ilovou-studio.firebaseio.com',
  projectId: 'ilovou-studio',
  storageBucket: '',
  messagingSenderId: '1067296930553'
};

const logConfig = {
  serverLoggingUrl: `${environment.url}/v1/logs`,
  level: environment.isProd ? NgxLoggerLevel.OFF : NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.ERROR
};

const ionicConfig = {
  mode: 'md',
  scrollAssist: false,
  autoFocusAssist: false,
  pageTransition: 'ios-transition',
  preloadModules: true
};

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    ionicGalleryModal.GalleryModalModule,
    CacheModule.forRoot({ keyPrefix: 'Plan ' }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp, ionicConfig),
    AngularFireModule.initializeApp(firebaseConfig),
    LoggerModule.forRoot(logConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    NativeAudio,
    Vibration,
    StatusBar,
    SplashScreen,
    Firebase,
    SoundService,
    DataService,
    AuthenticationService,
    RestaurantService,
    FcmService,
    NotificationService,
    FeedbackService,
    ToggleService,
    OrderService,
    CommonService,
    RetryService,
    NgxImageCompressService,
    TokenService,
    JwtHelper,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
export class AppModule { }
