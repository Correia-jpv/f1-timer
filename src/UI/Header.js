export default function Footer(props) {
  return (
    <header className="header">
      <div className="home-menu pure-menu pure-menu-horizontal">
        <a href="/">
          <h1 style={{ textAlign: 'center' }}>
            <img className="pure-img pure-menu-heading" src={props.logo} width={180} height={65} style={{}} alt="F1 timer" />
          </h1>
        </a>
      </div>
    </header>
  )
}
