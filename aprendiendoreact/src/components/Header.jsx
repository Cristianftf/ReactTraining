import './Header.css'

/**el Children se utiliza para poder pasar los props hijos que estan en la aplicacion principal, como el h1 que esta dentro del Header en la 
 * App.jsx
 */
export const Header = ({children,title,show}) => {
  return (
    <header className="header">
      <h1 className='header-title'>{title || "titulo por defecto "}</h1>
      {children}
      {
        /** esta es una forma de hacer el if
         */
        show ? <p>este texto aparecera si show es true</p> : <p>show es falso</p>
      }

    </header>
  );
};
