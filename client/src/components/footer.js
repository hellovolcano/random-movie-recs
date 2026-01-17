const Footer = () => {
    return (
        <footer>
            <div class="row">
                <div id="api-section" class="col l6 s12">
                  <h5 class="white-text">API Attribution Section</h5>
                  <p class="grey-text text-lighten-4">Movie information provided by <a href="https://www.omdbapi.com/" target="_blank">OMDb API</a>.</p>
                  <p class="grey-text text-lighten-4">Streaming data provided by <a href="https://api.watchmode.com" target="_blank">Watchmode API</a>.</p>

                </div>
                <div id="social-links" class="col l4 offset-l2 s12">
                  <h5 class="white-text">Share with friends</h5>
                  <ul>
                    <li><a href="https://facebook.com" target="_blank" class="fa fa-facebook"></a></li>
                    <li><a href="https://twitter.com" target="_blank" class="fa fa-twitter"></a></li>
                    <li><a href="https://instagram.com" target="_blank" class="fa fa-instagram"></a></li>
                    <li><a href="https://youtube.com" target="_blank" class="fa fa-youtube"></a></li>
                  </ul>  
                </div>
            </div>
            <div class="footer-copyright">
              © 2022 Copyright by Japes, Mogwai, Valerie
              </div>
        </footer>
    )
}

export default Footer