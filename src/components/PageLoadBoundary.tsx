import { Component, type ReactNode } from "react";

export default class PageLoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="page-loading section-shell" role="alert"><h1>This page couldn’t load.</h1><p>Please reload to try again.</p><button type="button" className="button dark" onClick={() => location.reload()}>Reload page</button></div>;
    return this.props.children;
  }
}
