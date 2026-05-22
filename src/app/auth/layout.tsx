import Link from "next/link";
import { ReactNode } from "react";
import styles from './layout.module.css';


interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      {/* <h1>Layout</h1>
      <Link href={'/auth/signin'}>Авторизоваться</Link>
      <Link href={'/auth/signup'}>Зарегистрироваться</Link> */}

      <div className={styles.wrapper}>
        <div className={styles.containerEnter}>
          <div className={styles.modal__block}>
            <form className={styles.modal__form}>
              {children}
            </form>
          </div>
        </div>
      </div>

    </>
  )
}