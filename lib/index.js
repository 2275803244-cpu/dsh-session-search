/**
 * Node half of dsh-client-ui-session-search.
 *
 * The Host loader instantiates every profile-patch row, so this package ships
 * an inert node-side entry (no services, no routes). The whole feature lives
 * in the browser half (lib/client.js), discovered via dsh.client metadata and
 * served at /plugins/dsh-client-ui-session-search/client.js.
 */
export function apply() {
  // Pure browser-plugin row: nothing to do on the Host plane.
}
