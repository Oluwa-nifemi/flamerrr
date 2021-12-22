class Detection {
    isPhone() {
        if (!this.hasCheckedIsPhone) {
            this.deviceIsAPhone = document.body.classList.contains('mobile')

            this.hasCheckedIsPhone = true;
        }

        return this.deviceIsAPhone
    }

    isTablet() {
        if (!this.hasCheckedIsTablet) {
            this.deviceIsATablet = document.body.classList.contains('tablet')

            this.hasCheckedIsTablet = true;
        }

        return this.deviceIsATablet
    }

    isDesktop() {
        if (!this.hasCheckedIsDesktop) {
            this.deviceIsADesktop = document.body.classList.contains('desktop')

            this.hasCheckedIsDesktop = true;
        }

        return this.deviceIsADesktop
    }
}

const DetectionManager = new Detection();

export default DetectionManager