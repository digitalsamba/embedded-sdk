var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const isFirefox = () => navigator.userAgent.toLowerCase().includes('firefox');
export const enumerateDevices = () => __awaiter(void 0, void 0, void 0, function* () {
    let devices = [];
    if (isFirefox()) {
        // getUserMedia call for FF;
        yield navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            devices = yield navigator.mediaDevices.enumerateDevices();
        }))
            .catch(() => __awaiter(void 0, void 0, void 0, function* () {
            devices = yield navigator.mediaDevices.enumerateDevices();
        }));
    }
    else {
        devices = yield navigator.mediaDevices.enumerateDevices();
    }
    return devices;
});
