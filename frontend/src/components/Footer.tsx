type FooterProps={
    completed:number;
    total:number;
}

function Footer({total, completed}: FooterProps) {
  return (
    <div className="footer">
      <p>Total:{total}</p>
      <p>Completed:{completed}</p>
      <p>Pending:{total - completed}</p>
    </div>
  );
}

export default Footer;
