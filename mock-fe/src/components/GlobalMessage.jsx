import PropTypes from 'prop-types';


GlobalMessage.propTypes = {
  message: PropTypes.string
};

export default function GlobalMessage({message = 'hello ya! message area~'}) {
  return (
    <div className="globalMessage">
      <wired-card>
        {message}
      </wired-card>
   </div>
  )
}
