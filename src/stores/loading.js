import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false,
        message: '',
        _minDisplayTime: 300, // 300ms minimum display time
        _showTime: null,     // Timestamp when loader was shown
        _timeoutId: null     // Timeout reference
    }),
    actions: {
        show(message = '') {
            // Clear any pending timeout
            if (this._timeoutId) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }

            // Set loading state
            this.isLoading = true;
            this.message = message;
            this._showTime = Date.now();

            // Set timeout to ensure minimum display time
            this._timeoutId = setTimeout(() => {
                this._timeoutId = null;
            }, this._minDisplayTime);
        },
        hide() {
            const elapsed = Date.now() - this._showTime;
            const remainingTime = this._minDisplayTime - elapsed;

            if (remainingTime > 0 && this._timeoutId) {
                // If minimum time hasn't elapsed yet, wait the remaining time
                clearTimeout(this._timeoutId);
                this._timeoutId = setTimeout(() => {
                    this._actuallyHide();
                }, remainingTime);
            } else {
                // Otherwise hide immediately
                this._actuallyHide();
            }
        },
        _actuallyHide() {
            this.isLoading = false;
            this.message = '';
            this._showTime = null;
            this._timeoutId = null;
        }
    }
});