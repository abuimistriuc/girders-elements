'use strict';

import 'jsdom-global/register';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { spy, stub, mock } from 'sinon';
import { mount, shallow, render } from 'enzyme';
import sinonChai from 'sinon-chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(chaiImmutable);

export { expect, spy, stub, mock, mount, shallow, render };
