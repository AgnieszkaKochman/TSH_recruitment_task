import './assets/scss/app.scss';
import $ from 'cash-dom';
import {fetch as fetchPolyfill} from 'whatwg-fetch'


const API_URL = 'https://api.github.com/users/'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export class App {
  initializeApp() {
    let self = this;

    $('.load-username').on('click', function (e) {
      let userName = $('.username.input').val();

      if (self.checkInput(userName)) {
        self.markInputValid()

        fetchPolyfill(API_URL + userName)
        .then((response)=> {
          return response.json()
        })
        .then(function (body) {
          self.profile = body;
          self.update_profile();

          fetchPolyfill(API_URL + userName + '/events/public')
            .then((response) => {
              return response.json()
            })
            .then((body) => {
              let index = 0
              $('#user-timeline').empty()

              for (let event of body) {
                let timelineClass = (index % 2 == 1) ? ' is-primary' : ''

                if (event.type == 'PullRequestEvent' || event.type == 'PullRequestReviewCommentEvent') {
                  index++
                  $('#user-timeline').append(self.prepareEventTemplate(event, timelineClass))
                }
              }
            })
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

  prepareEventTemplate(event, timelineClass) {
    let createdAt = new Date(event.created_at)
    let createdAtString = MONTHS[createdAt.getMonth()] + ' ' + createdAt.getDate() + ', ' + createdAt.getFullYear()

    let template = `<div class="timeline-item` + timelineClass + `">
                      <div class="timeline-marker` + timelineClass + `"></div>
                      <div class="timeline-content">
                        <p class="heading">` + createdAtString + `</p>
                        <div class="content level">
                          <div class="gh-user-avatar level-left">
                            <img src="` + event.actor.avatar_url + `"/>
                          </div>
                          <div class="gh-description level-right">
                            <p class="level-item">
                              <span class="gh-username gh-description__item">
                                <a href="` + event.actor.url + `">` + event.actor.display_login + `</a>
                              </span>
                              ` + event.payload.action

    if (event.type == 'PullRequestReviewCommentEvent') {
      template += `<a class="gh-description__item" href="` + event.payload.comment.html_url + `">comment</a>to`
    }

    template += `<a class="gh-description__item" href="` + event.payload.pull_request.html_url + `">pull request </a>
                </p>
                <p class="repo-name level-item">
                  <a class="gh-description__item" href="` + event.repo.url + `">` + event.repo.name + `</a>
                </p>
              </div>
            </div>
          </div>
        </div>`

    return template
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
