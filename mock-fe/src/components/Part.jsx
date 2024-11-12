import PropTypes from 'prop-types';
import './part.css'

export default function Part({width, height, children}) {
  return (
    <section className="part-outer" style={{width, height}}>
      <wired-card>
        <div className="part-inner" style={{width, height: `calc(${height} - 20px)`}}>
          {children || 'part slot here'}
        </div>
      </wired-card>
    </section>
  )
}

Part.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  children: PropTypes.node
};
