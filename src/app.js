import './assets/scss/app.scss';
import $ from 'cash-dom';
import {fetch as fetchPolyfill} from 'whatwg-fetch'


export class App {
  initializeApp() {
    let self = this;

    $('.load-username').on('click', function (e) {
      let userName = $('.username.input').val();

      if (self.checkInput(userName)) {
        self.markInputValid()

        fetchPolyfill('https://api.github.com/users/' + userName)
        .then((response)=> {
          return response.json()
        })
        .then(function (body) {
          self.profile = body;
          self.update_profile();
        })
      } else {
        self.markInputInvalid()
      }
    })

  }

  update_profile() {
    $('#profile-name').text($('.username.input').val())
    $('#profile-image').attr('src', this.profile.avatar_url)
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login)
    $('#profile-bio').text(this.profile.bio || '(no information)')
  }

  checkInput(value) {
    if (value.trim().length <= 0) {
      return false
    }

    let pattern = /^[a-z0-9_-]+$/

    if (!pattern.test(value)) {
      return false
    }

    return true
  }

  markInputValid() {
    if ($('.username.input').hasClass('invalid-input')) {
      $('.username.input').removeClass('invalid-input')
    }
  }

  markInputInvalid() {
    if (!$('.username.input').hasClass('invalid-input')) {
      $('.username.input').addClass('invalid-input')
    }
  }
}
