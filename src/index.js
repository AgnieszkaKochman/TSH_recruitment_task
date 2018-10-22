import styles from './assets/scss/app.scss';
import {App} from "./app";
import Promise from 'promise-polyfill';

if (!window.Promise) {
    window.Promise = Promise;
}

const app = new App();

app.initializeApp();
