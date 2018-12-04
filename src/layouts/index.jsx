import React from "react";
import Helmet from "react-helmet";
import styled, {ThemeProvider} from "styled-components"
import config from "../../data/SiteConfig";
import "./css/normalize.css"
import "./css/webflow.css"
import "./css/uport-51f8fe-896815bc956b8e53e437c9c3db.webflow.css"
import "../../node_modules/prism-themes/themes/prism-duotone-light.css"
import "./css/index.css";
import theme from './theme'
import getSelectedText from '../utilities/getSelectedText'
import track from '../utilities/track'

export default class MainLayout extends React.Component {
  componentDidMount() {
    this.trackTextSelection()
  }
  trackTextSelection = () => {
    const trackSelectedText = ev => {
      if(ev && ev.target && ev.target.getAttribute('data-do-not-track-copy')) {
        return
      }
      const selectedText = getSelectedText()
      if(selectedText) {
        track('Text Selected', {
          value: selectedText
        })
      }
    }
    document.addEventListener('mouseup', trackSelectedText, false)
    document.addEventListener('keyup', e => {
      const key = e.keyCode || e.which
      if(key === 16) {
        trackSelectedText
      }
    }, false)
  }
  getLocalTitle() {
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const pathPrefix = config.pathPrefix ? config.pathPrefix : "/";
    const currentPath = this.props.location.pathname
      .replace(pathPrefix, "")
      .replace("/", "");
    let title = "";
    if (currentPath === "") {
      title = "Home";
    } else if (currentPath === "categories/") {
      title = "Categories";
    } else if (currentPath === "about/") {
      title = "About";
    } else if (currentPath.includes("categories/")) {
      const category = currentPath
        .replace("categories/", "")
        .replace("/", "")
        .replace("-", " ");
      title = `${capitalize(category)}`;
    }
    return title;
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet>
          <title>{`${config.siteTitle} |  ${this.getLocalTitle()}`}</title>
          <meta name='description' content={config.siteDescription} />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Helmet>
        <ThemeProvider theme={theme}>
          {children()}
        </ThemeProvider>
      </div>
    );
  }
}
