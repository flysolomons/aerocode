function Container(props: any) {
    return ( 
        <div className="max-w-[1128px] mx-auto">
            {props.children}
        </div>
     );
}

export default Container;