import { PropTypes } from 'prop-types'

export default function Version({ version }) {
  return (
    <div className="version">{version ? `server version: ${version}` : 'local mode'}</div>
  )
}

Version.propTypes = {
  version: PropTypes.string
}