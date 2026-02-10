import React from 'react'

export default function FormLayout({ onSubmit, children, enctype, method, action ,full_H=true}) {
    return (
        <div className='form_container' style={{height:full_H?'calc(100vh - 5rem)':''}}>
            <form
                onSubmit={onSubmit}
                method={method}
                action={action}
                encType={enctype}
            >
                {children}
            </form>
        </div>
    )
}
