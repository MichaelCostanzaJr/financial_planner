import '../components/toggle.css'

function Toggle(){

    const setBright = (root) => {
        root.style.setProperty('--background-color', '#1e1e1e')
        root.style.setProperty('--nav-light', '#282828')
        root.style.setProperty('--primary-color', '#b9a40a')
        root.style.setProperty('--secondary-color', '#b5b4b4')
        root.style.setProperty('--accent-color', '#535252')
        root.style.setProperty('--accent-color-2', '#3c3c3c')
        root.style.setProperty('--text-light', '#c8c8c8')
        root.style.setProperty('--income-primary-color', '#88FFB5')
    }

    const setDark = (root) => {
        root.style.setProperty('--background-color', '#ffffff')
        root.style.setProperty('--nav-light', '#c2c2c2')
        root.style.setProperty('--primary-color', '#333333')
        root.style.setProperty('--secondary-color', '#e8e8e8')
        root.style.setProperty('--accent-color', '#e8e8e8')
        root.style.setProperty('--accent-color-2', '#bababa')
        root.style.setProperty('--text-light', '#000000')
        root.style.setProperty('--income-primary-color', '#b9a40a')
    }

    const toggleBtn = async(e) => {
        let toggle_btn = e.target.matches('.toggle-btn')
        if (toggle_btn){
            let btn = document.querySelector('.toggle-btn-container')
            btn.classList.toggle('on')
            let root = document.documentElement
            //if currently in bright mode change to dark
            if(root.style.getPropertyValue('--background-color') === '#ffffff'){
               setBright(root)
            }else{
                // if currently in dark mode, change to bright
                setDark(root)
            }
        }
    }

    return (
        <div className="toggle">
            <h4 className="toggle-title">Bright Mode</h4>
            <div className="toggle-btn-container">
                <div className="toggle-btn" onClick={toggleBtn}></div>
            </div>
        </div>
    )
}

export default Toggle