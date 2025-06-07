import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { LoadGraphService } from '../services/load-graph.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      imports: [ HttpClientTestingModule, FormsModule, NgxGraphModule ],
      providers: [ LoadGraphService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create MainComponent via TestBed', () => {
    const testFixture = TestBed.createComponent(MainComponent);
    const testComponent = testFixture.componentInstance;
    expect(testComponent).toBeTruthy();
  });

  it('updates groupsNodes on event', () => {
    const service = TestBed.inject(LoadGraphService);
    const testGroups = { group: [{ name: 'test' }] } as any;
    service.groupsNodesChangedEvent.emit(testGroups);
    expect(component.groupsNodes).toEqual(testGroups);
  });

});
